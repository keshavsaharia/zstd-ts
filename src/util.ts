import fs from 'fs'

import { ZSTD_BIN_PATH } from './zstd'

export function access(name: string, fileName: string, mode: number) {
	try {
		fs.accessSync(fileName, mode)
	}
	catch (error) {
		throw new Error('Cannot access ' + name)
	}
}

export function checkReadable(name: string, file: string) {
	return access(name, file, fs.constants.R_OK)
}

export function checkWritable(name: string, file: string) {
	return access(name, file, fs.constants.W_OK)
}

export function checkBinary() {
	return access('Zstd binary', ZSTD_BIN_PATH, fs.constants.R_OK | fs.constants.X_OK)
}
