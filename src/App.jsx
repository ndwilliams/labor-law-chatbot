import { useEffect, useState } from "react"
import {
	getAllFederalMenuTopics,
	getAllMenuTopics,
	getAllStates,
	getStateTopicsByState,
} from "./services/menuService"
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
	MainContainer,
	ChatContainer,
	MessageList,
	Message,
	MessageInput,
	TypingIndicator,
} from "@chatscope/chat-ui-kit-react"

export const App = () => {
	const [mainMenu, setMainMenu] = useState([])
	const [subMenu, setSubMenu] = useState(null)
	const [stateSubMenu, setStateSubMenu] = useState(null)
	const [messages, setMessages] = useState([
		{
			message: "Hello I am ChatBot",
			sender: "API",
			direction: "incoming",
		},
	])
	const [typing, setTyping] = useState(false)
	const [messageId, setMessageId] = useState(1)

	const getAndSetMainMenu = () => {
		getAllMenuTopics().then((menuArray) => {
			setMainMenu(menuArray)
		})
	}

	const handleMainMenuSelection = (mainMenuId) => {
		if (mainMenuId === "1") {
			getAllFederalMenuTopics()
				.then((federalMenuArray) => {
					if (Array.isArray(federalMenuArray)) {
						setSubMenu(federalMenuArray)
						setStateSubMenu(null)
					} else {
						console.error("getAllFederalMenuTopics returned non-array data")
					}
				})
				.catch((error) => {
					console.error("Error fetching federal menu topics:", error)
				})
		} else if (mainMenuId === "2") {
			getAllStates()
				.then((statesArray) => {
					if (Array.isArray(statesArray)) {
						setSubMenu(statesArray)
					} else {
						console.error("getAllStates returned non-array data")
					}
				})
				.catch((error) => {
					console.error("Error fetching states:", error)
				})
		} else {
			console.error("Invalid main menu ID:", mainMenuId)
		}
	}

	const handleStateSelection = (stateId) => {
		getStateTopicsByState(stateId).then((stateTopicsArray) =>
			setStateSubMenu(stateTopicsArray)
		)
	}

	useEffect(() => {
		getAndSetMainMenu()
	}, [])

	const handleSend = async (message) => {
		const newMessage = {
			message: message,
			sender: "user",
			direction: "outgoing",
		}

		const newMessages = [...messages, newMessage] //all the old messages, + the new message

		//update our messages state
		setMessages(newMessages)

		// set a typing indicator (LLM is typing)
		setTyping(true)
		// process message to LLM and see response
		await processMessageToAPI(newMessages)
		const newMessageId = messageId + 1
		setMessageId(newMessageId)
	}

	const processMessageToAPI = async (chatMessages) => {
		// chatMessages { sender: "user" or "LLM", message: "The message content here"}
		// apiMessages {role: "user" or "assistant", content: "The message content here"}

		// let apiMessages = chatMessages.map((messageObject, i) => {
		// 	let sender = ""
		// 	if (messageObject.sender === "API") {
		// 		sender = "API"
		// 	} else {
		// 		sender = "user"
		// 	}
		// 	return { id: i, sender: sender, content: messageObject.message }
		// })

		// role: "user" -> a message from the user, "assistant": -> a response from LLM
		// "system" -> generally one initial message defining HOW we want LLM to talk

		// const systemMessage = {
		// 	role: "system",
		// 	content: "Explain all concepts like I am 10 years old.", // Speak like a pirate, Explain like I am a 10 years of experience software engineer
		// }

		// const apiRequestBody = {
		// 	model: "gpt-3.5-turbo",
		// 	messages: [systemMessage, ...apiMessages],
		// }

		// questions:
		// 1: "What is the overtime pay rate for non-exempt employees"
		// 2: "What is the federal minimum wage, and when was it last updated?"
		// 3: "Are employers required to provide meal breaks and rest periods under federal labor laws?"
		// 4: "Can employers deduct wages from an employee's paycheck for damaged equipment or cash register shortages under federal labor laws?"
		// 5: "Are salaried employees exempt from overtime pay under federal labor laws?"

		await fetch(`http://localhost:8088/messages?id=${messageId}`)
			.then((data) => {
				return data.json()
			})
			.then((data) => {
				console.log(data)

				setMessages([
					...chatMessages,
					{
						id: data[0].id,
						message: data[0].message,
						sender: "API",
						direction: "incoming",
					},
				])

				setTyping(false)
			})
	}

	return (
		<div className="app-container">
			<div className="menu-selection-container">
				<select
					className="main-menu-form"
					onChange={(event) => handleMainMenuSelection(event.target.value)}>
					<option value={0}>Select Labor Breadth</option>
					{mainMenu.map((menuTopic) => {
						return (
							<option
								className="main-menu-topic"
								value={menuTopic.id}
								key={menuTopic.id}>
								{menuTopic.topic}
							</option>
						)
					})}
				</select>
				{subMenu && subMenu[0].topic ? (
					<select
						className="federal-topic-list"
						// onChange={(event) => {
						// 	handleFederalSubMenuSelection(event.target.value)
						// }}
					>
						<option value={0}>Federal Labor Topic</option>
						{subMenu.map((subMenuTopic) => {
							return (
								<option
									className="federal-topic"
									value={subMenuTopic.id}
									key={subMenuTopic.id}>
									{subMenuTopic.topic}
								</option>
							)
						})}
					</select>
				) : (
					""
				)}
				{subMenu && subMenu[0].state ? (
					<select
						className="state-list"
						onChange={(event) => {
							handleStateSelection(event.target.value)
						}}>
						<option value={0}>Select A State</option>
						{subMenu.map((state) => {
							return (
								<option className="state" value={state.id} key={state.id}>
									{state.state}
								</option>
							)
						})}
					</select>
				) : (
					""
				)}
				{stateSubMenu && stateSubMenu.length ? (
					<select className="state-topic-list">
						<option value={0}>Select A Labor Topic</option>
						{stateSubMenu.map((stateMenuTopic) => {
							return (
								<option
									className="state-topic"
									value={stateMenuTopic.id}
									key={stateMenuTopic.id}>
									{stateMenuTopic.topic}
								</option>
							)
						})}
					</select>
				) : (
					""
				)}
			</div>
			<div className="chat-ui-container relative h-3/4 w-3/5">
				<MainContainer>
					<ChatContainer>
						<MessageList
							scrollBehavior="smooth"
							typingIndicator={
								typing ? <TypingIndicator content="LLM is typing" /> : null
							}>
							{messages.map((message, i) => {
								return <Message key={i} model={message} />
							})}
						</MessageList>
						<MessageInput placeholder="Type message here" onSend={handleSend} />
					</ChatContainer>
				</MainContainer>
			</div>
		</div>
	)
}
