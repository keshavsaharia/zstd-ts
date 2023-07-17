# zstd-ts

TypeScript functions for reading/writing Zstd compressed files. Includes Zstd binaries for Linux, Windows, and Mac OSX.

## Compression

The `compress` function takes a path to an input and output file destination. The optional third parameter specifies the
compression level, between 1 and 22.

```typescript
import { compress } from 'zstd-ts'

async function main() {
	await compress('/path/to/input.zstd', '/path/to/output')
	await compress('/path/to/input.zstd', '/path/to/output', 20)
}
```

## Decompression

The `decompress`, `streamDecompress`, and `decompressToStream` functions provide the option to decompress an entire file
into a target directory, or stream the contents of the compressed file in memory for processing.

```typescript
import { decompress, streamDecompress } from 'zstd-ts'

async function main() {
	await decompress('/path/to/input.zstd', '/path/to/output')

	// Read the input
	const stream = await streamDecompress('/path/to/input.zstd')
	stream.on('data', (data: Buffer) => {
		console.log(data.toString())
	})
	stream.on('error', (error) => {
		console.error(error)
	})
	stream.on('end', () => {
		console.log('Done reading compressed file')
	})
}
```

## Author

[Keshav Saharia](https://keshav.is) created this for reading [Lichess PGN files](https://database.lichess.org/).
