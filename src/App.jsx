import { useEffect, useState } from "react"
import {
	getAllFederalMenuTopics,
	getAllMenuTopics,
	getAllStates,
	getStateTopicsByState,
} from "./services/menuService"

export const App = () => {
	const [mainMenu, setMainMenu] = useState([])
	const [subMenu, setSubMenu] = useState(null)
	const [stateSubMenu, setStateSubMenu] = useState(null)

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

	return (
		<>
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
		</>
	)
}
