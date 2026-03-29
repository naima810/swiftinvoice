"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CompanySettingsPage() {

  const supabase = createClient();

  const [color, setColor] = useState("#2563eb");
  const [form, setForm] = useState({
  company_name:"",
  company_email:"",
  phone:"",
  website:"",
  address:""
});
  const saveBusinessProfile = async()=>{

 try{

 const {
  data:{user}
 } = await supabase.auth.getUser();

 if(!user){

  alert("Login required");

  return;
 }

 // check existing

 const {data:existing} =
 await supabase
 .from("business_profiles")
 .select("id")
 .eq("user_id",user.id)
 .single();

 if(existing){

 await supabase
 .from("business_profiles")
 .update({

  ...form,

  invoice_primary_color:color

 })
 .eq("user_id",user.id);

 }
 else{

 await supabase
 .from("business_profiles")
 .insert({

  user_id:user.id,

  ...form,

  invoice_primary_color:color

 });

 }

 alert("Saved Successfully");

 }
 catch(error){

 console.error(error);

 alert("Something went wrong");

 }

};

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">
            Business Profile
          </h1>

          <p className="text-gray-500 text-sm">
            Manage your business profile and email integrations.
          </p>
        </div>

        <button

 onClick={saveBusinessProfile}

 className="p-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"

>

Save Changes

</button>
      </div>

      <div className="space-y-8 max-w-5xl">

        {/* COMPANY INFO */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="font-semibold text-lg mb-4">
            Company Information
          </h2>

          <div className="grid md:grid-cols-2 gap-2">

            <Input
 label="Company Name"
 value={form.company_name}
 onChange={(e)=>
 setForm({
  ...form,
  company_name:e.target.value
 })
 }
/>
            <Input
 label="Company Email"
 value={form.company_email}
 onChange={(e)=>
 setForm({
  ...form,
  company_email:e.target.value
 })
 }
/>
            <Input
 label="Phone"
 value={form.phone}
 onChange={(e)=>
 setForm({
  ...form,
  phone:e.target.value
 })
 }
/>
            <Input
 label="Website"
 value={form.website}
 onChange={(e)=>
 setForm({
  ...form,
  website:e.target.value
 })
 }
/>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">
                Address
              </label>

              <textarea

 value={form.address}

 onChange={(e)=>
 setForm({
  ...form,
  address:e.target.value
 })
 }

 className="p-4 w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
 rows={3}
/>
            </div>

          </div>
        </div>

        {/* BRANDING */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="font-semibold text-lg mb-4">
            Branding
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* LOGO */}
            <div>

              <p className="text-sm text-gray-600 mb-2">
                Company Logo
              </p>

              <div className="border-2 border-dashed rounded-xl h-40 flex items-center justify-center cursor-pointer hover:bg-gray-50">

                <span className="text-gray-400">
                  + Upload Logo
                </span>

              </div>

            </div>

            {/* COLOR PICKER */}
            <div>

              <p className="text-sm text-gray-600 mb-2">
                Invoice Primary Color
              </p>

              <input
                type="color"
                value={color}
                onChange={(e)=>setColor(e.target.value)}
                className="w-20 h-12 border rounded cursor-pointer"
              />

              {/* PREVIEW */}
              <div className="">
                <button className="p-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Preview
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* EMAIL INTEGRATION */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="font-semibold text-lg mb-4">
            Email Integration
          </h2>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

            <p className="text-gray-600 text-sm max-w-md">
              Send invoices and reminders directly from your
              business Gmail account.
            </p>

            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium">
              Connect Gmail
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}


// reusable input component
function Input({
 label,
 value,
 onChange
}:{

 label:string,
 value?:string,
 onChange?:(e:any)=>void

}){

return(

<div className="flex flex-col">

<label className="text-sm font-medium text-gray-600">

{label}

</label>

<input

value={value}
onChange={onChange}

className="mt-2 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"

/>

</div>

);

}