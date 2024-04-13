import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

// next: next request
const createNew = async (req, res, next) => {
  /**
  * Note: Mặc định chúng ta không cần phải custom message ở phía BE làm gì vì đề cho Front-end tự validate và custom message phía FE cho đẹp.
  * Back-end chỉ cần validate Đảm Bào Dữ Liệu Chuần Xác, và trả về message mặc định từ thư viện là được.
  * Quan trọng: Việc Validate dữ liệu BẮT BUỘC phải có ở phía Back-end vì đây là điểm cuối để lưu trữ dữ Liệu vào Database.
  * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ Liệu ở cả Back-end và Front-end nhé.
  */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title min: 3 chars',
      'string.max': 'Title max: 50 chars',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    console.log(req.body)

    // Chỉ định abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗi (video 52)
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // next()
    res.status(StatusCodes.CREATED).json({ message: 'POST from Validation: API create new board.' })
  } catch (error) {
    console.log(error)

    // Mã này thường dùng cho dữ liệu thực thể không thể xử lý (thực thi)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }

}

export const boardValidation = {
  createNew
}
