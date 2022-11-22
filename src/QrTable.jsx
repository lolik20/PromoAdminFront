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
import Switch from '@mui/material/Switch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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
maxHeight:"85vh",
  bgcolor: 'background.paper',
  border: 'none',
  outline:'none',
  boxShadow: 24,
  p: 4,
};
export default function QrTable(){
    const [requests,setRequests]=useState(null)
    const [isModal,setModal]= useState(false)
    const [reason,setReason] =useState("")
    const [isDeclineModal,setDeclineModal]=useState(false)
    const [image,setImage] =useState("")
    const [count,setCount]=useState(0)
    const [query,setQuery]=useState("")
    const [binOptions,setBinOptions]=useState([])
    const [fiscalOptions,setFiscalOptions] =useState([])
    const [rowsPerPage,setRowsPerPage]=useState(10)
    const [page,setPage]=useState(0)
    const [isLoader,setLoader]=useState(true)
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
    function EditFiscal(photoId,fiscal){
      let newState = [...requests];
      newState.find(x=>x.photoId===photoId).fiscal=fiscal;
      setRequests(newState)
    }
    function EditBin(photoId,bin){
      let newState = [...requests];
      newState.find(x=>x.photoId===photoId).bin=bin;
      setRequests(newState)
    }
    function EditFiscal(photoId,fiscal){
      let newState = [...requests];
      newState.find(x=>x.photoId===photoId).fiscal=fiscal;
      setRequests(newState)
    }
    async function OpenDeclineModal(id){
      localStorage.setItem("id",id)
      setDeclineModal(true)
    }
    async function Accept(id){
      let obj = requests.find(x=>x.photoId===id)

    await axios.put(`${urls.main}/api/admin/qr/accept?id=${id}&code=${obj.code}`)
    .then(response=>{
      Fetch()
    })
  }
  async function BinOptions(){
    await axios.get(`${urls.main}/api/admin/bins`).then(response=>{
        setBinOptions(response.data)
    })
  }
  async function FiscalOptions(){
    await axios.get(`${urls.main}/api/admin/fiscal`).then(response=>{
        setFiscalOptions(response.data)
    })
  }
    async function DownloadImage(){
      var a = document.createElement("a"); //Create <a>
      a.href = "data:image/jpg;base64," + image; //Image Base64 Goes here
      a.download = "image.jpg"; //File name Here
      a.click()
    }
    async function Decline(id){
        await axios.put(`${urls.main}/api/admin/qr/decline?id=${id}&reason=${reason}`)
        .then(response=>{
          Fetch()
          setDeclineModal(false)
        })
      }
    async function GetPhoto(id){
      setLoader(true)
      await axios.get(`${urls.main}/api/admin/photo?id=${id}&isQr=true`)
      .then(response=>{
        setImage(response.data)
        setModal(true)
      })
      setLoader(false)
    }
  async  function Fetch(){
      setLoader(true)
      await axios.get(`${urls.main}/api/admin/qr?skip=${page*rowsPerPage}&take=${rowsPerPage}&query=${query}`).then(response=>{
           setRequests(response.data.codes)
           setCount(response.data.count)
           setLoader(false)

       })
    
      
    }
    useEffect(()=>{
      Fetch()
    },[rowsPerPage,page])

    
    useEffect(()=>{
      Fetch()
      BinOptions()
      FiscalOptions()
    },[])
    return(
        <React.Fragment>
          <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={isLoader}
  onClick={()=>setLoader(false)}
>
  <CircularProgress color="inherit" />
</Backdrop>
                  <TextField id="standard-basic" value={query} onChange={(e)=>setQuery(e.target.value)} label="Номер телефона или ID фотографии" variant="standard" />
        <h1 style={{color:"red"}}>В РАЗРАБОТКЕ</h1>
        <TableContainer component={Paper}>

        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Номер телефона</TableCell>
              <TableCell align="center">ID фотографии</TableCell>
              <TableCell align="center">Приз</TableCell>
              <TableCell align="center">Дата</TableCell>
              <TableCell align="center">Канал</TableCell>
              <TableCell align="center">Статус</TableCell>

              <TableCell align="center">ФП</TableCell>
              <TableCell align="center">БИН</TableCell>

              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {requests?.map((row) => (
              <TableRow
                key={row.sourceActivationId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{row.phoneNumber}</TableCell>
                <TableCell align="center"><span onClick={()=>GetPhoto(row.photoId)} style={{cursor:"pointer"}}>{row.photoId}</span></TableCell>
                <TableCell align="center">{row.prize!=null?row.prize:"Ожидает подтверждения"}</TableCell>
                <TableCell align="center">
                {row.date}
                </TableCell>
                
                <TableCell align="center">
                {row.channel}

                </TableCell>
                <TableCell align="center">
                {row.status}

                </TableCell>
               <TableCell style={{textAlign:"center"}}>
                {row.status ==="InProgress"&&
                  <TextField
                  id="outlined-name"
                  label=""
                  value={row.code}
                  onChange={(e)=>EditFiscal(row.photoId,e.target.value)}
                />}
                
                
            
</TableCell>
               <TableCell style={{textAlign:"center"}}>
                {row.status==="InProgress"
                &&
                <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={row.bin}
          label="БИН"
          onChange={(e)=>EditBin(row.photoId,e.target.value)}
        >
            {
                binOptions.map((x,i)=>{
                  return(
                    <MenuItem key={i} value={x}>{x}</MenuItem>
                  )

                })
            }
         
        </Select>
                }
               

               </TableCell>

                <TableCell align="center">
                  <button className='button'  onClick={()=>Accept(row.photoId)}>
              <CheckOutlinedIcon width={18} height={18} color="success"></CheckOutlinedIcon>
              </button>
                </TableCell>
                
                <TableCell align="center">
                  <button className='button' onClick={()=>OpenDeclineModal(row.photoId)}>
                  <CloseIcon width={18} height={18} color="error" ></CloseIcon>

                  </button>

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

  </Box>
</Modal>
<Modal
  open={isDeclineModal}
  onClose={()=>setDeclineModal(false)}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
<Box sx={style} style={{width:200}}>

<TextField id="standard-basic" label="Причина отказа" variant="standard" value={reason} onChange={(e)=>setReason(e.target.value)} />

<Button variant="outlined" style={{width:200}} onClick={()=>{Decline(localStorage.getItem("id"))}}>Отклонить</Button>

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