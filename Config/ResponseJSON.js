const success = (data) => {
  return {
    status: true,
    data: data
  }
}

const failed = (message) => {
  return {
    status: false,
    message: message
  }
}

export default {
  success: (data) => success(data),
  failed: (message) => failed(message)
}
