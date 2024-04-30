import { useState } from "react"

export const App = () => {
	const [count, setCount] = useState(0)

	const handleBtnClick = () => {
		console.log("clicked!")
		setCount(count + 1)
	}

	return (
		<>
			<h1>Hello!</h1>
			<div>This is Amazing!</div>
			<button
				className="btn-secondary"
				onClick={() => {
					handleBtnClick()
				}}>
				Click me!
			</button>
			<div>Count: {count}</div>
		</>
	)
}
