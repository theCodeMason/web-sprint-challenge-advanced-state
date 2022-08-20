import axios from 'axios';
import * as types from './action-types';

export function moveClockwise() {
  return {type: types.MOVE_CLOCKWISE}
}

export function moveCounterClockwise() {
  return {type: types.MOVE_COUNTERCLOCKWISE}
}

export function selectAnswer(answer_id) {
  return {type: types.SET_SELECTED_ANSWER, payload: answer_id}
}

export function setMessage() {
  return {type: types.SET_INFO_MESSAGE}
}

export function setQuiz() {
  return {type: types.SET_QUIZ_INTO_STATE} 
}

export function inputChange({id, value}) {
  return {
    type: types.INPUT_CHANGE, payload: {id, value}}
}

export function resetForm() {
  return {type: types.RESET_FORM}
}

export function fetchQuiz() {
  return function (dispatch) {
    dispatch({type: types.SET_QUIZ_INTO_STATE, payload: null})
    axios.get('http://localhost:9000/api/quiz/next')
      .then(res => {
        dispatch({type: types.SET_QUIZ_INTO_STATE, payload: res.data})
      })
      .catch(err => console.error({err}))
  }
}
export function postAnswer(questionId, answerId) {
  return function (dispatch) {
    console.log('postAnswer action dispatch', {'quiz_id': questionId, 'answer_id': answerId})
    axios.post('http://localhost:9000/api/quiz/answer', {'quiz_id': questionId, 'answer_id': answerId})
      .then(res => {
        console.log('Response from successful answer post: ', res)
        dispatch({type: types.SET_SELECTED_ANSWER, payload:null})
        dispatch({type: types.SET_INFO_MESSAGE, payload:res.data.message})
        dispatch(fetchQuiz())
      })
      .catch(err => console.error(err))
  }
}

export function postQuiz(form) {
  return function (dispatch) {
    axios.post('http://localhost:9000/api/quiz/new', {"question_text": form.newQuestion, "true_answer_text": form.newTrueAnswer, "false_answer_text": form.newFalseAnswer})
      .then(res => {
        console.log('postQuiz success: ', res)
        const newQuestion = res.data
        dispatch({type: types.SET_INFO_MESSAGE, payload: `Congrats: "${newQuestion.question}" is a great question!`})
        dispatch({type: types.RESET_FORM})
      })
      .catch(err => console.error(err))
  }
}
