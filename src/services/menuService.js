export const getAllMenuTopics = () => {
	return fetch(`http://localhost:8088/mainMenu`).then((res) => res.json())
}

export const getAllFederalMenuTopics = () => {
	return fetch(`http://localhost:8088/federalMenu`).then((res) => res.json())
}

export const getAllStates = () => {
	return fetch(`http://localhost:8088/stateMenu`).then((res) => res.json())
}

export const getStateTopicsByState = (stateId) => {
	return fetch(`http://localhost:8088/stateTopicMenu?state_id=${stateId}`).then(
		(res) => res.json()
	)
}
