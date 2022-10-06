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
import TextField from '@mui/material/TextField';

const axios = require('axios').default;

const style = {
  gap:2,
  position: 'absolute',
  top: '50%',
  left: '50%',
  alignItems:"center",
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
export default function TotalTable(){
    const [requests,setRequests]=useState([])
    const [isModal,setModal]= useState(false)
    const [reason,setReason] =useState("")
    const [isDeclineModal,setDeclineModal]=useState(false)
    const [image,setImage] =useState("")
    const [query,setQuery]=useState("")
    const [count,setCount]=useState(0)
    const [rowsPerPage,setRowsPerPage]=useState(10)
    const [page,setPage]=useState(0)
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  useEffect(()=>{
    Fetch()
  },[query])
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    async function OpenDeclineModal(id){
      localStorage.setItem("id",id)
      setDeclineModal(true)
    }
    async function DownloadImage(){
      var a = document.createElement("a"); //Create <a>
      a.href = "data:image/jpg;base64," + image; //Image Base64 Goes here
      a.download = "image.jpg"; //File name Here
      a.click()
    }
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
        Fetch()

      }).catch(error=>{
        window.location.href="/login"
      })
    }
  async  function Fetch(){
       await axios.get(`${urls.main}/api/admin/all?skip=${page*rowsPerPage}&take=${rowsPerPage}&query=${query}`).then(response=>{
            setRequests(response.data.codes)
            setCount(response.data.count)
        })
    }
    useEffect(()=>{
      Fetch()
    },[rowsPerPage,page])
    useEffect(()=>{
      Login()
    },[])
    return(
        <React.Fragment>
                <TextField value={query} onChange={(e)=>setQuery(e.target.value)} id="standard-basic" label="Номер телефона или ID фотографии"  variant="standard" />

        <TableContainer component={Paper}>

        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Номер телефона</TableCell>
              <TableCell align="center">ID фотографии</TableCell>
              <TableCell align="center">Приз</TableCell>
              <TableCell align="center">Статус</TableCell>
              <TableCell align="center">Причина отказа</TableCell>
              <TableCell align="center">Дата создания</TableCell>

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
                <TableCell align="center">{row.prize==null?"-":row.prize}</TableCell>

                <TableCell align="center">
                  {row.status}
                </TableCell>
                <TableCell align="center">
                {row.reason == null?"-":row.reason}

                </TableCell>
                <TableCell align="center">
                {row.date}

                </TableCell>


  
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal
  open={isModal}
  onClose={()=>setModal(false)}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description">

  <Box sx={style}>
          <img className='codeImage' src={`data:image/jpeg;base64,${image}`}></img>
          <Button variant="outlined" style={{width:200}} onClick={()=>DownloadImage()}>Загрузить</Button>

          <Button variant="outlined" onClick={()=>setModal(false)}>Закрыть</Button>

  </Box>
</Modal>

      </TableContainer>
      <TablePagination
            
          component="div"
        count={count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
  </React.Fragment>

    );
}