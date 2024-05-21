/* eslint-disable no-trailing-spaces */
// Boards list

import { Box, Stack, Typography } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  checkAuthAPI,
  getListBoardByUserId,
  getUserIdByTokenAPI
} from '~/apis'
import { mockData } from '~/apis/mock-data'
import AppBar from '~/components/AppBar/AppBar'
import BoardCardVisual from '~/components/BoardCardVisual/BoardCardVisual'
import CategoryBar from '~/components/CategoryBar/CategoryBar'

// const ListBoard = [
//   {
//     _id: 'board-id-01',
//     title: 'MERN Stack Board 1',
//     description: 'MERN stack Course 1',
//     type: 'public',
//     color: 'red'
//   },
// ]

const ListBoard = mockData.boards

function getRandomColor() {
  // Sinh ngẫu nhiên các giá trị RGB trong khoảng từ 0 đến 255
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  
  // Tạo mã màu từ các giá trị RGB
  const color = `rgb(${r}, ${g}, ${b})`

  return color
}

function BoardList() {
  const [listBoard, setListBoard] = useState([])
  const [userId, setUserId] = useState(null)
  const [page, setPage] = useState(1)
  const boardsPerPage = 8 // Số lượng boards hiển thị trên mỗi trang

  const indexOfLastBoard = page * boardsPerPage
  const indexOfFirstBoard = indexOfLastBoard - boardsPerPage
  const currentBoards = listBoard.slice(indexOfFirstBoard, indexOfLastBoard)
  // const currentBoards = ListBoard.slice(indexOfFirstBoard, indexOfLastBoard)
  const [auth, setAuth] = useState(false)
  const navigate = useNavigate()
  axios.defaults.withCredentials = true

  const [boardUpdated, setBoardUpdated] = useState(false)

  // Render Board khi update
  const updateBoardUpdated = () => {
    setBoardUpdated(prevState => !prevState)
  }

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1]

  const fetchUserId = async () => {
    try {
      const response = await getUserIdByTokenAPI({
        headers: {
          Authorization: `Bearer ${token}` // Gửi token trong header
        }
      })
      setUserId(response.userId) // Lấy userId từ phản hồi
    } catch (error) {
      console.log('Error fetching userId')
    }
  }

  // useEffect(() => {
  //   // Check authentication on component mount
  //   checkAuthAPI()
  //     .then((res) => {
  //       if (res.status === 'Success') {
  //         setAuth(true)
  //       } else {
  //         navigate('/login')
  //         setAuth(false)
  //       }
  //     })
  //     .catch(() => {
  //       navigate('/login')
  //       setAuth(false)
  //     })
  // }, [navigate])

  useEffect(() => {
    fetchUserId()
    // fetchListBoardAPI()
    if (userId) { // Kiểm tra xem userId đã có giá trị hay chưa
      // getListBoardByUserId(userId)
      getListBoardByUserId(userId)
        .then(listBoard => {
          setListBoard(listBoard)
        })
        .catch(error => {
          console.error('Error fetching boards:', error)
        })
    }
  }, [userId, boardUpdated]) // Chạy khi userId thay đổi


  return (
    <div>
      <AppBar updateBoardUpdated={updateBoardUpdated}></AppBar>
      <Stack direction="row" justifyContent="space-between"
      >
        <CategoryBar
          nameActive="Boards"
        />
        <Box flex={5}
          sx={{
            pt: 2,
            pl: 5,
            pr: 5,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495E' : '#fff')
          }}
        >
          <Typography variant="h6"
            sx={{
              fontSize: 40,
              mb: 5
            }}
          >
                        Your boards
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: '20px', // Khoảng cách giữa các thẻ
              '@media (min-width: 807px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
                gridTemplateColumns: 'repeat(2, 1fr)' // Hiển thị 5 phần tử trên một hàng
              },
              '@media (min-width: 997px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 768px
                gridTemplateColumns: 'repeat(3, 1fr)' // Hiển thị 5 phần tử trên một hàng
              },
              '@media (min-width: 1221px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 992px
                gridTemplateColumns: 'repeat(4, 1fr)' // Hiển thị 4 phần tử trên một hàng
              },
              '@media (min-width: 1600px)': { // Thêm media query để điều chỉnh số cột trên mỗi hàng cho các kích thước màn hình lớn hơn 1200px
                gridTemplateColumns: 'repeat(5, 1fr)' // Hiển thị 3 phần tử trên một hàng
              }
            }}
          >
            {currentBoards.map(board => (
              <BoardCardVisual
                key={board._id}
                title={board.title}
                description={board.description}
                type={board.type}
                color= {getRandomColor()}
                boardId={board._id}
                updateBoardUpdated={updateBoardUpdated} 
                board={board}
              />
            ))}

          </Box>
          <Pagination
            count={Math.ceil(listBoard.length / boardsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            sx={{ position: 'fixed', bottom: 0, right: 0, margin: '20px' }}
          />

        </Box>
      </Stack>
    </div>
  )
}

export default BoardList