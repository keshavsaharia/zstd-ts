import fs from 'fs'
import path from 'path'
import { spawn, execFile } from 'child_process'
import { EventEmitter } from 'events'

import {
	checkReadable,
	checkWritable,
	checkBinary
} from './util'

import {
	ZSTD_BIN_PATH
} from './zstd'

export async function decompress(input: string, output: string, level: number = 3): Promise<string> {
	// Ensure not writing to input source
	if(input == output)
		throw new Error('Input and output files cannot be the same.')

	// Bound compression level
	level = (level < 1) ? 1 : (level > 22 ? 22 : level)

	// Ensure file access
	checkReadable('input file', input)
	checkWritable('output directory', path.dirname(output))
	checkBinary()

	// Wrap executable in Promise, should be no stdout output if successful.
	return new Promise((resolve: (outputFile: string) => any, reject) => {
		execFile(ZSTD_BIN_PATH, ['-f', '-d', input, '-o', output], (error, stdout, stderr) => {
			if (error)
				reject(error)
			else if (stdout)
				reject(stdout)
			else if (stderr)
				reject(stderr)
			else
				resolve(output)
		})
	})

}

export async function streamDecompress(input: string): Promise<EventEmitter> {
	var emitter = new EventEmitter()

	checkReadable('input file', input)
	checkBinary()

	// Bind standard output to event emitter data
	var proc = spawn(ZSTD_BIN_PATH, ['-d', input, '-c'])
	proc.stdout.on('data', (data) => {
		emitter.emit('data', data)
	})

	// Bind exit/error of process to emitter events
	proc.once('exit', (code, signal) => {
		if(code == 0)
			emitter.emit('end')
		else if(code == 39)
			emitter.emit('error', new Error('Not in zstd format'))
		else
			emitter.emit('error', new Error('Unexpected stream close. Code ' + code + '. Signal' + signal))

		proc.stdout.removeAllListeners('data')
		proc.removeAllListeners('error')
	})

	// Bind process error to emitter
	proc.once('error', (error) => {
		emitter.emit('error', error)
		proc.stdout.removeAllListeners('data')
		proc.removeAllListeners('exit')
	})

	return emitter
}

export async function decompressToStream(input: string, stream: fs.WriteStream): Promise<EventEmitter> {
	var emitter = new EventEmitter()

	checkReadable('input file', input)
	checkBinary()

	// Bind standard output to event emitter data
	let finished = false
	let exitCode: number | undefined
	var proc = spawn(ZSTD_BIN_PATH, ['-d', input, '-c'])
	proc.stdout.pipe(stream)

	// Bind exit/error of process to emitter events
	proc.on('exit', (code, signal) => {
		if(code == 0)
			emitter.emit('end')
		else if (code == 39)
			emitter.emit('error', new Error('Not in zstd format'))
		else if (code != null)
			emitter.emit('error', new Error('Unexpected stream close. Code ' + code + '. Signal' + signal))
		exitCode = code

		if (finished)
			emitter.emit('finish')
		proc.removeAllListeners('error')
	})

	stream.on('error', (error) => {
		emitter.emit('error', error)
		proc.kill()
		stream.removeAllListeners('finish')
	})

	stream.on('finish', () => {
		finished = true
		if (exitCode == 0)
			emitter.emit('finish')
		stream.removeAllListeners('error')
	})

	// Bind process error to emitter
	proc.on('error', (error) => {
		emitter.emit('error', error)
		proc.removeAllListeners('exit')
	})

	return emitter
}
