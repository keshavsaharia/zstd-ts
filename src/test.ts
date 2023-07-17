import { streamDecompress } from '.'

async function main() {
	try {
		const stream = await streamDecompress('/Users/keshav/Downloads/lichess_db_horde_rated_2023-06.pgn.zst')
		stream.on('data', (data) => {
			console.log(data.toString())
		})
		stream.on('end', () => {
			console.log('Done')
		})
	}
	catch (error) {
		console.log('error', error)
	}
	console.log('Done')
}

main()
