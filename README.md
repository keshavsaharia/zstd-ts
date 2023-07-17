# TypeScript zstd

TypeScript functions for reading/writing Zstd compressed files. Includes Zstd binaries for Linux, Windows, and Mac OSX.

## Compression

The `compress` function takes a path to an input and output file destination. The optional third parameter specifies the
compression level, between 1 and 22.

```typescript
import { compress } from 'ts-zstd'

async function main() {
	await compress('/path/to/input.zstd', '/path/to/output')
	await compress('/path/to/input.zstd', '/path/to/output', 20)
}
```

## Decompression

The `decompress`, `streamDecompress`, and `decompressToStream` functions provide the option to decompress an entire file
into a target directory, or stream the contents of the compressed file in memory for processing.

```typescript
import { decompress, streamDecompress } from 'ts-zstd'

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

## Roadmap

- Read directly from URL (pipe output stream to decompression)
- Stream reader that splits content by delimiter and returns chunks to callback function
	- Use case: split PGN files by regex to test for newlines/EOF
- Testing
	- Integrate Jest/ts-jest framework
	- Create test compressed files

## Author

[Keshav Saharia](https://keshav.is) created this for reading [Lichess PGN files](https://database.lichess.org/).
