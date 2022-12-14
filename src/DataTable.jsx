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
import gif from "./tea.gif"
import Autocomplete from '@mui/material/Autocomplete';

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
const reasons = [
  { label: 'Чтобы продолжить, пожалуйста, предоставьте корректный ИИН в своем профиле	'},
{label:"Ошибка. Этот код уже активирован!"},
{label:"Фото повторяется"},
{label:"Фото с интернета"},
{label:"Нет промокода"},
{label:"Фото с прилавка"},
  {label:"Отсутсвует фото чая"},
{label:"Плохое качество фотографии"}]
export default function DataTable(){
    const [requests,setRequests]=useState([])
    const [isModal,setModal]= useState(false)
    const[checked,setChecked]=useState(false)
    const [reason,setReason] =useState("")
    const [isDeclineModal,setDeclineModal]=useState(false)
    const [image,setImage] =useState("")
    const [count,setCount]=useState(0)
    const [query,setQuery]=useState("")
    const [rowsPerPage,setRowsPerPage]=useState(10)
    const [page,setPage]=useState(0)
    const [isLoader,setLoader]=useState(true)
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
   
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    function EditCode(photoId,code){
      let newState = [...requests];
      newState.find(x=>x.photoId===photoId).code=code
      setRequests(newState)
    }
    async function OpenDeclineModal(id){
      localStorage.setItem("id",id)
      setDeclineModal(true)
    }
    async function Accept(id){
      let obj = requests.find(x=>x.photoId===id)

    await axios.put(`${urls.main}/api/admin/accept?id=${id}&code=${obj.code}`)
    .then(response=>{
      Fetch()
    })
  }
    async function DownloadImage(){
      var a = document.createElement("a"); //Create <a>
      a.href = "data:image/jpg;base64," + image; //Image Base64 Goes here
      a.download = "image.jpg"; //File name Here
      a.click()
    }
    async function Decline(id){
  
        await axios.put(`${urls.main}/api/admin/decline?id=${id}&reason=${reason}`)
        .then(response=>{
          Fetch()
          setDeclineModal(false)
        })
      }
    async function GetPhoto(id){
      setLoader(true)
      await axios.get(`${urls.main}/api/admin/photo?id=${id}`)
      .then(response=>{
        setImage(response.data)
        setModal(true)
      })
      setLoader(false)
    }
    async function Login(){
      await axios.post(`${urls.main}/api/admin/login`,{login:localStorage.getItem("login"),password:localStorage.getItem("password")})
      .then(response=>{
        Fetch()

      }).catch(error=>{
        window.location.href="/login"
      })
    }
    useEffect(()=>{
      Fetch()
    },[checked])
  async  function Fetch(){
    setLoader(true)
       await axios.get(`${urls.main}/api/admin/requests?skip=${page*rowsPerPage}&take=${rowsPerPage}&query=${query}&country=${checked?1:0}`).then(response=>{
            setRequests(response.data.codes)
            setCount(response.data.count)
        })
        setLoader(false)
    }
    useEffect(()=>{
      Fetch()
    },[rowsPerPage,page,query])
    useEffect(()=>{
      Login()
    },[])
    return(
        <React.Fragment>
          <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={isLoader}
  onClick={()=>setLoader(false)}
>
<img src={gif} style={{borderRadius:10}}></img>
</Backdrop>
                  <TextField id="standard-basic" value={query} onChange={(e)=>setQuery(e.target.value)} label="Номер телефона или ID фотографии" variant="standard" />
                 
<div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
  <span>KZ</span>
<Switch
  checked={checked}
  onChange={()=>setChecked(!checked)}
  inputProps={{ 'aria-label': 'controlled' }}
/>
<span>KG</span>
</div>
        <TableContainer component={Paper}>

        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Номер телефона</TableCell>
              <TableCell align="center">ID фотографии</TableCell>
              <TableCell align="center">Приз</TableCell>
              <TableCell align="center">Дата</TableCell>
              <TableCell align="center">Страна</TableCell>
              <TableCell align="center">Канал</TableCell>
              <TableCell align="center">Код</TableCell>

              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((row) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
           
                <TableCell align="center">{row.phoneNumber}</TableCell>
                <TableCell align="center"><span onClick={()=>GetPhoto(row.photoId)} style={{cursor:"pointer"}}>{row.photoId}</span></TableCell>
                <TableCell align="center">{row.prize==null?"ожидает подтверждения":row.prize}</TableCell>
                <TableCell align="center">
                {row.date}

                </TableCell>
                <TableCell align="center">
                {row.country}

                </TableCell>
                <TableCell align="center">
                {row.channel}

                </TableCell>
                <TableCell>
                    {row.isManual&&
                    
                    <TextField
                    id="outlined-name"
                    label=""
                    key={row.photoId}
                    value={row.code}
                    onChange={(e)=>EditCode(row.photoId,e.target.value)}
                  />}
   {!row.isManual&&
                  <span>{row.code}</span>
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
<Box sx={style}>

<Autocomplete
                selectOnFocus
                disableClearable
                id="combo-box-demo"
                options={reasons}
                value={reason}
                onChange={(event,newValue)=>{
                  setReason(newValue.label)
                }}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField value={reason} onChange={(e)=>setReason(e.target.value)}  {...params} label="Причина" />}
              />
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