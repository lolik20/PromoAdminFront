import React, { useState,useEffect } from 'react'; 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';
import urls from './urls.json'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseIcon from '@mui/icons-material/Close';
import './DataTable.css'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const axios = require('axios').default;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  justifyContent:"center",
  display:"flex",
  flexDirection:"column",
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  border: 'none',
  outline:'none',
  boxShadow: 24,
  p: 4,
};
export default function DataTable(){
    const [requests,setRequests]=useState([])
    const [isModal,setModal]= useState(false)
    const [image,setImage] =useState("")
    async function GetPhoto(id){
      await axios.get(`${urls.main}/api/admin/photo?id=${id}`)
      .then(response=>{
        setImage(response.data)
        setModal(true)
      })
    }
    async function Login(){
      await axios.post(`${urls.main}/api/admin/login`,{login:localStorage.getItem("login"),password:localStorage.getItem("password")})
      .then(response=>{
        
      }).catch(error=>{
        window.location.href="/login"
      })
    }
  async  function Fetch(){
       await axios.get(`${urls.main}/api/admin/requests`).then(response=>{
            setRequests(response.data)
        })
    }
    useEffect(()=>{
      Login()
        Fetch()
    },[])
    return(
        <React.Fragment>
        <TableContainer component={Paper}>

        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Номер телефона</TableCell>
              <TableCell align="center">ID фотографии</TableCell>
              <TableCell align="center">Приз</TableCell>

              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((row) => (
              <TableRow
                key={row.sourceActivationId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
           
                <TableCell align="center">{row.phoneNumber}</TableCell>
                <TableCell align="center"><span onClick={()=>GetPhoto(row.photoId)} style={{cursor:"pointer"}}>{row.photoId}</span></TableCell>
                <TableCell align="center">{row.prize==null?"ожидает подтверждения":row.prize}</TableCell>

                <TableCell align="center">
                  <button className='button'>
              <CheckOutlinedIcon width={18} height={18} color="success"></CheckOutlinedIcon>
              </button>
                </TableCell>
                
                <TableCell align="center">
                  <button className='button'>
                  <CloseIcon width={18} height={18} color="error" ></CloseIcon>

                  </button>

                </TableCell>

                {/* <TableCell align="center">{row.prize}</TableCell> */}

  
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal
  open={isModal}
  onClose={()=>setModal(false)}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
          <img src={`data:image/jpeg;base64,${image}`}></img>
          <Button variant="text" onClick={()=>setModal(false)}>Закрыть</Button>

  </Box>
</Modal>
      </TableContainer>
      {/* <TablePagination
          style={{color:"#fff",backgroundColor:"#FDD536"}}  
          component="div"
        count={countPassive}
        page={pagePassive}
        onPageChange={handleChangePagePassive}
        rowsPerPage={rowsPerPagePassive}
        onRowsPerPageChange={handleChangeRowsPerPagePassive}
      /> */}
  </React.Fragment>

    );
}