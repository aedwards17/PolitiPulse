import React from 'react'
import {useForm} from 'react-hook-form'

export default function Register() {

  const {
    register,
    handleSubmit,
    formState: { errors }
  
  } = useForm()

  const onSubmit = data => {
    console.log(data);
  }

  return (
    <div className="Reg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-control'>
          <label>Email</label>
          <input type="text" name="email" {...register("email")} />
        </div>
        <div className='form-control'>
          <label>Password</label>
          <input type="password" name="password" {...register("password")} />
        </div>
        <div className='form-control'>
          <label></label>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}
