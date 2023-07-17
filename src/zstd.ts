import path from 'path'

const ZSTD_BIN = process.platform === 'win32' ?
					(process.arch === 'x64' ? 'zstd64.exe' : 'zstd32.exe') :
					(process.platform === 'darwin' ? 'zstd.darwin' : 'zstd.linux64')

export const ZSTD_BIN_PATH = path.resolve(__dirname, '../bin', ZSTD_BIN)
