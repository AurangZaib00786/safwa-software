import React, { useState , useEffect,useRef } from 'react'
import { useParams } from 'react-router-dom'
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'react-qr-code';
import numberToWords from 'number-to-words';
import './sale_invoice.css'
import { toArabicWord } from 'number-to-arabic-words/dist/index-node.js'

function Invoice_3() {
    const {name} = useParams()
    const [company, setcompany] = useState(JSON.parse(localStorage.getItem("selected_branch")))
    const response=JSON.parse(localStorage.getItem("data"))
    const [data,setdata] = useState(response)
    const optimize =  response.details.map((item,index)=>{
        item['sr']=index+1
        return item
      })
    const [details , setdetails] = useState(optimize)

    const name_column_formater = (cell, row)=>{
        return(
            
          <div style={{width:'20vw'}}>
            {cell}
            
          </div>
        )
      }
      const headerstyle = (column, colIndex) => {
        const englishHeader = column.text.english;
        const arabicHeader = column.text.arabic;
      
        return (
          <div>
            <div>{englishHeader}</div>
            <div>{arabicHeader}</div>
          </div>
        );
      }
      const columns = [
          { dataField: 'sr', text: {english:'SR' , arabic:''},headerFormatter:headerstyle},
          { dataField: 'product_code',text: { english: 'Item  Code', arabic: 'رقم الصنف' }, headerFormatter:headerstyle}, 
          { dataField: 'product_name',text: { english: 'Description', arabic: 'وصف' }, formatter:name_column_formater , headerFormatter:headerstyle,},   
          { dataField: 'quantity',text: { english: 'QTY', arabic: 'الكمية' },  headerFormatter:headerstyle},      
          { dataField: 'price',text: { english: 'Unit Price', arabic: ' سعر الوحدة' } ,headerFormatter:headerstyle},
          { dataField: 'sub_total',text: { english: 'Total', arabic: ` السعر الاجمالي` } ,headerFormatter:headerstyle},
          
        ];

        const columns_1 = [
            { dataField: 'sr', text: {english:'SR' , arabic:''},headerFormatter:headerstyle},
            { dataField: 'product_code',text: { english: 'Item  Code', arabic: 'رقم الصنف' }, headerFormatter:headerstyle}, 
            { dataField: 'product_name',text: { english: 'Description', arabic: 'وصف' }, formatter:name_column_formater , headerFormatter:headerstyle,},   
            { dataField: 'quantity',text: { english: 'QTY', arabic: 'الكمية' },  headerFormatter:headerstyle},    
            { dataField: 'unit',text: { english: 'Units', arabic: 'الكمية' },  headerFormatter:headerstyle},    
            { dataField: 'price',text: { english: 'Unit Price', arabic: ' سعر الوحدة' } ,headerFormatter:headerstyle},
            
            { dataField: 'sub_total',text: { english: 'Total', arabic: ` السعر الاجمالي` } ,headerFormatter:headerstyle},
            
          ];

        const componentRef = useRef()
        const handleprint = useReactToPrint({
        content : () => componentRef.current ,
        bodyClass: 'printclass',
        onAfterPrint : ()=>{
           
            window.close()
            
        }
        })

      
        useEffect(()=>{
        if (data){
            handleprint()
        }
        
    },[data])
        

  return (
    <div className=' w-100 '  ref={componentRef}>


        {data && 
            <div className="container">
                <div className="row mt-2">
                <div className="col-5 text-center no-space m-0 p-2 pe-5">
                    <h4 className='m-0' style={{color:'#7fa82b'}}>{company.name}</h4>
                    
                    <p className='m-0 font-en'>C.R No: {company.cr_number}</p>
                    <p className='m-0 font-en'>Address: {company.address}</p>
                    <p className='m-0 font-en'>VAT Number: {company.vat_number}</p>
                    
                    
                </div>
                <div className="col-2 p-0 text-center">
                    
                    <img src={company.logo} alt='logo' width={'140px'} height={'140px'}></img>
                    
                </div>
                <div className="col-5 text-center no-space m-0 p-2 ps-4">
                    <h4 className='m-0 arabic-heading' style={{color:'#7fa82b'}}>{company.arabic_name}</h4>
                    <p className='m-0 font-light'> س.ت: {company.cr_number_arabic}</p>
                    <p className='m-0 font-light'>العنوان:  {company.address_arabic}</p>
                    <p className='m-0 font-light'>الرقم الضريبي: {company.vat_number_arabic}</p>
                   
                    
                </div>
            </div>

            {name==='purchases' && <h4 className=" m-2 text-center">Purchase -   <strong className='font'> الشراء</strong></h4>}
            {name==='sales' &&  <div className="d-flex align-items-end justify-content-end mt-2 mb-2">
               
                <h4 className="  invoice-heading text-center">Tax Invoice - <strong className='arabic-heading'>فاتورة ضريبية</strong></h4>
                

                <div className="p-0 pe-3 text-end qr-code">
                <QRCode
                    
                    value={data.qr_code}
                    bgColor={'#FFFFFF'}
                    fgColor={'#000000'}
                    size={100}
                />
                </div>
            </div>}
            {name==='quotation' && <h4 className=" m-2 text-center">Quotation -  <strong className='font'>عرض اسعار</strong></h4>}
            {name==='delivery_notes' && <h4 className=" m-2 text-center">Delivery Notes -   <strong className='font'>مذكرات التسليم</strong></h4>}
            {name==='sale_order' && <h4 className=" m-2 text-center">Sale Order -   <strong className='font'> امر البيع</strong></h4>}


            {name!=='purchases' ? <div className="d-flex justify-content-between  mt-0" style={{border: '1px solid black'}}>
                <div className="col-sm-4 p-1 text-start">
    
                    <h6 className="mb-0"><strong>Client</strong></h6>
                    <p className="mb-0 font-en" ><strong>Name :</strong></p>
                    <p className="mb-0 font-en" ><strong>VAT No : </strong></p>
                    <p className="mb-0 font-en"><strong>Shipped To : </strong></p>
                </div>
                <div className="col-sm-4 p-1 text-center">
                    <br/>
                    <p className="mb-0 font-en" >{data.customer_info.name}</p>
                    <p className="mb-0 font-en" >{data.customer_info.vat_number}</p>
                    <p className="mb-0 font-en">{data.customer_info.address}</p>
                </div>
                <div className="col-sm-4 text-end p-1 text-end">
                    <h6 className="mb-0 font-light"><strong>العميل</strong></h6>
                    <p className="mb-0 font-light" ><strong>: اسم</strong></p>
                    <p className="mb-0 font-light" ><strong>: الرقم الضريبي</strong></p>
                    <p className="mb-0 font-light"><strong>: شحنت الي</strong></p>
                </div>
            </div>:
            <div className="d-flex justify-content-between  mt-0" style={{border: '1px solid black'}}>
            <div className="col-sm-4 p-1 text-start">

                <h6 className="mb-0"><strong>Client</strong></h6>
                <p className="mb-0 font-en" ><strong>Name :</strong></p>
               
            </div>
            <div className="col-sm-4 p-1 text-center">
                <br/>
                <p className="mb-0 font-en" >{data.supplier_name}</p>
                
            </div>
            <div className="col-sm-4 text-end p-1 text-end">
                <h6 className="mb-0 font-light"><strong>العميل</strong></h6>
                <p className="mb-0 font-light" ><strong>: اسم</strong></p>
                
            </div>
        </div>}
            {name==='sales' && <div className="d-flex justify-content-start mt-0 " style={{border: "1px solid black"}}>
                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Invoice NO</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.invoice}</div>
                        <div className="col-sm-4 d-flex justify-content-between font-ar" ><strong>:</strong><strong>رقم الفاتورة</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Currency</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >SAR</div>
                        <div className="col-sm-4 d-flex justify-content-between font-ar" ><strong>:</strong><strong>العملة</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Delivery NO</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.delivery_details.delivery_number}</div>
                        <div className="col-sm-4 d-flex justify-content-between font-ar" ><strong>:</strong><strong>رقم التسليم</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Customer PO NO</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.delivery_details.PO_number}</div>
                        <div className="col-sm-4 d-flex justify-content-between font-ar" ><strong>:</strong><strong>رقم أمر شراء</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Payment Term</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.delivery_details.payment_terms}</div>
                        <div className="col-sm-4 d-flex justify-content-between font-ar" ><strong>:</strong><strong>شروط الدفع</strong></div>
                    </div>
                </div>
                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Invoice Date</strong><strong>:</strong></div>
                        <div className="col-3 p-0 text-center">{data.date}</div>
                        <div className="col-4 d-flex justify-content-between font-ar" ><strong>:</strong><strong>تاريخ الفاتورة</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-5 d-flex justify-content-between" ><strong>VAT ID</strong><strong>:</strong></div>
                        <div className="col-3 p-0 text-center" >{data.customer_info.vat_number}</div>
                        <div className="col-4 d-flex justify-content-between font-ar" ><strong>:</strong><strong>رقم الضريبة</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-5 d-flex justify-content-between " ><strong>Delivery Date</strong><strong>:</strong></div>
                        <div className="col-3 p-0 text-center" >{data.delivery_details.delivery_date}</div>
                        <div className="col-4  d-flex justify-content-between font-ar" ><strong>:</strong><strong>تاريخ سند التسليم</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-5 d-flex justify-content-between" ><strong>Customer PO Date</strong><strong>:</strong></div>
                        <div className="col-3 p-0 text-center" >{data.delivery_details.PO_date}</div>
                        <div className="col-4 d-flex justify-content-between font-ar" ><strong>:</strong><strong>تاريخ أمر شراء</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-5 d-flex justify-content-between" ><strong>Incoterms</strong><strong>:</strong></div>
                        <div className="col-3 p-0  text-center" >{data.delivery_details.inco_terms}</div>
                        <div className="col-4 d-flex justify-content-between font-ar" ><strong>:</strong><strong>شروط التسليم</strong></div>
                    </div>
                </div>
            </div>}

            {name==='quotation' && <div className="d-flex justify-content-start mt-0 " style={{border: "1px solid black"}}>
                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Quotation NO</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.quotation_number}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong> رقم عرض أسعار</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Currency</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >SAR</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>العملة</strong></div>
                    </div>
                
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Payment Term</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.payment_terms}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>شروط الدفع</strong></div>
                    </div>
                </div>

                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Quotation Date</strong><strong>:</strong></div>
                        <div className="col-3 p-0 text-center">{data.date}</div>
                        <div className="col-4 d-flex justify-content-between" ><strong>:</strong><strong> تاريخ عرض أسعار</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-5 d-flex justify-content-between" ><strong>VAT ID</strong><strong>:</strong></div>
                        <div className="col-3 p-0 text-center" >{data.customer_info.vat_number}</div>
                        <div className="col-4 d-flex justify-content-between" ><strong>:</strong><strong>رقم الضريبة</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-5 d-flex justify-content-between " ><strong>Delivery Date</strong><strong>:</strong></div>
                        <div className="col-3 p-0 text-center" >{data.delivery_date}</div>
                        <div className="col-4  d-flex justify-content-between" ><strong>:</strong><strong>تاريخ سند التسليم</strong></div>
                    </div>
                    
                </div>
            </div>}

            {name==='sale_order' && <div className="d-flex justify-content-start mt-0 " style={{border: "1px solid black"}}>
                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>order NO</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.order_number}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>  رقم الأمر </strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Delivery Date</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.delivery_date}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>  نوع الدفع </strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Payment Terms</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.payment_terms}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>  شروط الدفع   </strong></div>
                    </div>
                    
                    
                </div>

                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Date</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.date}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>  تاريخ </strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Valid Date</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.valid_date}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>   تاريخ صالح  </strong></div>
                    </div>
                    
                </div>

                
            </div>}

            {name==='purchases' && <div className="d-flex justify-content-start mt-0 " style={{border: "1px solid black"}}>
                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Purchase NO</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.invoice}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>  رقم الشراء</strong></div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Payment Type</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.payment_type}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>  نوع الدفع </strong></div>
                    </div>
                    
                </div>

                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Date</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.date}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>  تاريخ </strong></div>
                    </div>
                    
                </div>

                
            </div>}
            
            {name==='delivery_notes' && <div className="d-flex justify-content-start mt-0 " style={{border: "1px solid black"}}>
                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Delivery NO</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.delivery_number}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong> رقم الشحنه</strong></div>
                    </div>
                    
                </div>

                <div className="col-sm-6 p-1">
                    <div className="row mb-1">
                        <div className="col-sm-5 d-flex justify-content-between" ><strong>Delivery Date</strong><strong>:</strong></div>
                        <div className="col-sm-3 p-0 text-center" >{data.date}</div>
                        <div className="col-sm-4 d-flex justify-content-between" ><strong>:</strong><strong>  تاريخ التسليم</strong></div>
                    </div>
                    
                </div>

                
            </div>}

            <div className="d-flex justify-content-center align-items-center mt-0" style={{backgroundColor:'rgb(189, 241, 199)',borderLeft: "1px solid black", borderRight:"1px solid black"}}>
                <h5 className='mb-0 p-1'>Details التفاصيل</h5>
    
            </div>
            <div className='p-0 m-0' style={{border: "1px solid black" ,  minHeight:'35vh'}} >
                <table class="table mb-0">
                    <tbody>
                        {details.map((item,index)=>{
                            return(<tr style={{backgroundColor:'rgb(209, 214, 213)',borderBottom: "1px solid black"}}>
                               
                                    <td className="small-cell " style={{borderRight: "1px solid black", borderLeft: "1px solid black"}}>{index+1}</td>
                                    <td className="large-cell">Code : {item.product_code} <br/> Name : {item.product_name}</td>
                                    {name!=='delivery_notes' ? <td className="english-cell" style={{borderRight: "1px solid black"}}>
                                        <div className="row">
                                            <div className="col-5 d-flex justify-content-between" ><span>Qty</span><span>:</span></div>
                                            <div className="col-3 p-0 text-center" >{item.quantity}</div>
                                            <div className="col-4 d-flex justify-content-between font-ar" ><span>:</span><span> الكمية</span></div>
                                        </div>
                                        <div className="row ">
                                            <div className="col-5 d-flex justify-content-between" ><span>U.Price</span><span>:</span></div>
                                            <div className="col-3 p-0 text-center" >{item.price}</div>
                                            <div className="col-4 d-flex justify-content-between font-ar" ><span>:</span><span> سعر الوحدة </span></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5 d-flex justify-content-between" ><span>Sub Total</span><span>:</span></div>
                                            <div className="col-3 p-0 text-center" >{item.sub_total} </div>
                                            <div className="col-4 d-flex justify-content-between font-ar" ><span>:</span><span> المجموع الفرعي </span></div>
                                        </div>
                                        <div className="row ">
                                            <div className="col-5 d-flex justify-content-between" ><span>{company.vat_percentage}% VAT &nbsp; -Value</span><span>:</span></div>
                                            <div className="col-3 p-0 text-center" >{item.vat_amount}</div>
                                            <div className="col-4 d-flex justify-content-between font-ar" ><span>:</span><span>{company.vat_percentage}%  قيمة الضريبة</span></div>
                                        </div>
                                        <div className="row ">
                                            <div className="col-5 d-flex justify-content-between" ><span>Total</span><span>:</span></div>
                                            <div className="col-3 p-0 text-center" >{item.total}</div>
                                            <div className="col-4 d-flex justify-content-between font-ar" ><span>:</span><span>الإجمالي العام</span></div>
                                        </div>
                                    </td>:
                                    <td className="english-cell" style={{borderRight: "1px solid black"}}>
                                    <div className="row">
                                        <div className="col-5 d-flex justify-content-between" ><span>Qty</span><span>:</span></div>
                                        <div className="col-3 p-0 text-center" >{item.quantity}</div>
                                        <div className="col-4 d-flex justify-content-between font-ar" ><span>:</span><span> الكمية</span></div>
                                    </div>
                                </td>}
                                                        
                            </tr>)
                        })}
                    </tbody>

                </table>
            </div>
            
        
            {name!=='delivery_notes' && <div style={{border: "1px solid black"}}>
                <div className="d-flex justify-content-between m-0 p-1">
                    <div className='col-6 d-flex justify-content-between me-1'>
                        <div className="col-sm-5 text-start">
                            <strong className="mb-0 d-flex justify-content-between "><span>Subtotal Excl. VAT</span><span>:</span></strong>
                            <strong className="mb-0 d-flex justify-content-between "><span>Total Incl. VAT </span><span>:</span></strong>
                            
                        </div>
                        <div className="col-sm-3 text-center">
                        <p className="mb-0">{data.sub_total}</p>
                            <p className="mb-0">{data.total}</p>
                            
                        </div>
                        <div className="col-sm-4 text-end">
                        <p className="mb-0 d-flex justify-content-between "><span>:</span><span className='font-ar'>الاجمالي الفرعي</span></p>
                            <p className="mb-0 d-flex justify-content-between "><span>:</span><span className='font-ar'>اجمالي العام شامل</span></p>
                            
                        </div>
                    </div>

                    <div className='col-6 d-flex justify-content-between'>
                        <div className=" col-sm-5 text-start">
                            <strong className="mb-0 d-flex justify-content-between "><span>Special Discount</span><span>:</span></strong>
                            <strong className="mb-0 d-flex justify-content-between "><span>Total VAT </span><span>:</span></strong>
                            
                        </div>
                        <div className="col-sm-3 text-center">
                            <p className="mb-0">{data.discount+data.extra_disc}</p>
                            <p className="mb-0">{data.vat_amount}</p>
                            
                        </div>
                        <div className="col-sm-4 text-end">
                            <p className="mb-0 d-flex justify-content-between "><span>:</span><span className='font-ar'>الخصم الخاص</span></p>
                            <p className="mb-0 d-flex justify-content-between "><span>:</span><span className='font-ar'>جمالي الضربية</span></p>
                            
                        </div>
                    </div>
                
                
                </div>
                <div className='text-center'>
                    {numberToWords.toWords(data.total).toUpperCase()} SAR
                </div>
                <div className='text-center font-ar'>
                    {toArabicWord(data.total)}
                </div>
            </div>}

            <div className='d-flex justify-content-between'>
                <div className='me-1'><strong >{company.name}</strong></div>
                {name==='sales' && <div className='me-1 font-ar'>تتطلب نسخة الفاتورة الكترونية المرفقة توقيعا<br/>E-Invoice copy does not require a signature</div>}
                <div className='me-1'><strong>{company.arabic_name}</strong></div>
            </div>
            <hr className='mb-1 mt-1'  style={{opacity:'1'}}/>

            

            <div className='d-flex justify-content-center'>
                <div className=''><span className='font'> العنوان:</span><span >{company.address_arabic}</span></div>
                <div className=''><span className='font'> ضريبة القيمة:</span><span>{company.vat_number_arabic}</span></div>
                <div className=''><span>{company.email}:</span><span className='font'> البريد الكتروني</span></div>
            </div>

            <div className='d-flex justify-content-center'>
                <div className='me-1'><span className='me-1'>Email:</span><span>{company.email}</span></div>
                <div className='me-1'><span className='me-1'>- VAT:</span><span>{company.vat_number}</span></div>
                <div className='me-1'><span className='me-1'>- Address:</span><span>{company.address}</span></div>
            </div>
        </div>
            }
    </div>
  )
}

export default Invoice_3