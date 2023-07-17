import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'

import { access } from './util'

import {
	ZSTD_BIN_PATH
} from './zstd'

export async function compress(input: string, output: string, level: number = 3): Promise<string> {
	// Ensure not writing to input source
	if(input == output)
		throw new Error('Input and output files cannot be the same.')

	// Bound compression level
	level = (level < 1) ? 1 : (level > 22 ? 22 : level)

	// Ensure file access
	access('input file', input, fs.constants.R_OK)
	access('output directory', path.dirname(output), fs.constants.W_OK)
	access('Zstd binary', ZSTD_BIN_PATH, fs.constants.R_OK | fs.constants.X_OK)

	// Wrap executable in Promise, should be no stdout output if successful.
	return new Promise((resolve: (outputFile: string) => any, reject) => {
		execFile(ZSTD_BIN_PATH, ['-f', '-' + level, input, '-o', output], (error, stdout, stderr) => {
			if (error)
				reject(error)
			else if (stdout)
				reject(stdout)
			else if (stderr)
				reject(stderr)
			else
				resolve(output)
		});
	})

}
