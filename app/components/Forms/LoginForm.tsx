"use client"
import {useFormik} from "formik"
import Link from "next/link";
import * as Yup from "yup"

// Login Form

export default function LoginForm(){

    // for form validation
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema : Yup.object({
            username: Yup.string().required("Please enter username").min(4,"Must be at least 4 characters"),
            password: Yup.string().required("Please enter password").min(4,"Must be at least 4 characters")
        }),
        onSubmit: async values => {
            const loginDetails = new URLSearchParams({
                username: values.username,
                password: values.password
              }).toString();
            console.log("login_details", loginDetails)
            try{
                const response = await fetch('http://localhost:8000/token', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: loginDetails
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                  }
          
                  const data = await response.json();
                  document.cookie = `access_token=${data.access_token}; Path=/; `;
                  window.location.href = '/boards'; // Redirect to protected page
                  
            }
            catch (error){
                console.log("Couldnt verify credentials")
                console.error(error)
            }


        }
    }) 

    return (
        <form 
        className=" flex flex-col p-4  w-1/4 rounded-md gap-2"
        onSubmit={formik.handleSubmit}>
            <h1 className="text-3xl font-bold text-ce">Login</h1>
            <div className="flex flex-col gap-1">
                <label
                className="text-sm text-gray-400"
                >Username</label>
                <input type="text" id="username"
                className="border-gray-300 border-solid border rounded-md p-2"
                value={formik.values.username}
                onChange={formik.handleChange}
                placeholder="Enter your username..."
                />
                {(formik.touched.username && formik.errors.username) && <p className="text-red-600 text-xs">{formik.errors.username}</p>}
            </div>
            <div className="flex flex-col gap-1 mt-4">
                <label className="text-sm text-gray-400">Password</label>
                <input type="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className="border-gray-300 border-solid border  rounded-md p-2"
                placeholder="Enter your password..."
                />

                {(formik.touched.password && formik.errors.password) && <p className="text-red-600  text-xs">{formik.errors.password}</p>}
            </div>
            <div className="text-sm flex justify-end gap-2">
                No account?  <Link href="/signup" className="font-bold"> Create account </Link>
            </div>
            <button type="submit" className="w-full mt-2 bg-zinc-800 rounded hover:bg-zinc-600 p-2 text-white ">Login</button>
        </form>
    )
}