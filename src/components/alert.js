import Swal from 'sweetalert2'
import {toast} from 'react-toastify'

export default function alertDelete(data, icon, text){
    return Swal.fire({
        title: 'Are you sure?',
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33', 
        confirmButtonText: 'Yes!'
     })
}

export const alertSuccess = (message) => {
  return toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000
  });
}

export const alertDanger = (message) => {
  return toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000
  });
}