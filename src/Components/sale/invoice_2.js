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

function Invoice_2() {
    const {name} = useParams()
    const [company, setcompany] = useState(JSON.parse(localStorage.getItem("selected_branch")))
    const response=JSON.parse(localStorage.getItem("data"))
    const [data,setdata] = useState(response)
    
    var quantity=0
    const optimize =  response.details.map((item,index)=>{
        item['sr']=index+1
        if (name==='delivery_notes'){
            quantity=quantity+item.quantity
        }
        
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
          <div className='text-center'>
            <div>{englishHeader}</div>
            <div>{arabicHeader}</div>
          </div>
        );
      }

      const qty_formatter=(cell,row)=>{
        return(
            <div className='text-end pe-5' style={{width:'10rem'}}>
                {cell}
            </div>
        )

      }
      const columns = [
          { dataField: 'sr', text: {english:'SR' , arabic:''},headerFormatter:headerstyle},
          { dataField: 'product_code',text: { english: 'Item  Code', arabic: 'رقم الصنف' }, headerFormatter:headerstyle}, 
          { dataField: 'product_name',text: { english: 'Description', arabic: 'وصف' }, formatter:name_column_formater , headerFormatter:headerstyle,},   
          { dataField: 'quantity',text: { english: 'Quantity', arabic: 'الكمية' },formatter:qty_formatter,  headerFormatter:headerstyle},      

          
        ];

        const columns_1 = [
            { dataField: 'sr', text: {english:'SR' , arabic:''},headerFormatter:headerstyle},
            { dataField: 'product_code',text: { english: 'Item  Code', arabic: 'رقم الصنف' }, headerFormatter:headerstyle}, 
            { dataField: 'product_name',text: { english: 'Description', arabic: 'وصف' }, formatter:name_column_formater , headerFormatter:headerstyle,},   
            { dataField: 'quantity',text: { english: 'QTY', arabic: 'الكمية' },  headerFormatter:headerstyle},    
            // { dataField: 'unit',text: { english: 'Units', arabic: 'الكمية' },  headerFormatter:headerstyle},    
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


            {data && <div style={{fontFamily:"'Times New Roman', Times, serif"}}><div className="row" style={{color:'#0d6efd'}}>
            
            <div className="col-sm-6 ms-3 text-start">
                <img src={company.logo} alt='logo' width={'100px'} height={'80px'}></img>
            </div>
            <div className="col-sm-4 text-end">
                <h5 className="m-0 text-end">{company.arabic_name}</h5>
                <h5 className="m-0">{company.name}</h5>
                <h5 className="m-0" style={{ fontWeight:'normal'}}> التسجيل التجاري:{company.cr_number_arabic} </h5>
                
                                    
            </div>
        </div>
        <hr className='mb-1'  style={{border:'2px solid #0d6efd' , borderRadius:'5px',opacity:'1'}}/>
        {name==='sales' && <h5 className='text-center'>
                   SIMPLIFIED TAX INVOICE / فاتورة ضريبية مبسطة 
        </h5>}
        {name==='purchases' && <h5 className='text-center '>
                   Purchase /   الشراء 
        </h5>}
        {name==='quotation' && <h5 className='text-center '>
                    Quotation /  عرض السعر
        </h5>}
        {name==='delivery_notes' && <h5 className='text-center '>
            Delivery Notes /   مذكرات التسليم
        </h5>}
        {name==='sale_order' && <h5 className='text-center '>
            Sale Order /    امر البيع
        </h5>}

        {name==='sale_order' && 
        <div className='d-flex justify-content-between mt-2 p-4' >

            <div className=' text-left'>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Name / الاسم:</span><span className='me-3'>{data.customer_info.name}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>VAT Number / رقم الضربية:</span><span className='me-3'>{data.customer_info.vat_number}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Contact / رقم الاتصال:</span><span className='me-3'>{data.customer_info.contact}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Address / الاسم:</span><span className='me-3'>{data.customer_info.address}</span></h6>
                
                

            </div>
            <div className=' text-left'>

                <h6 className="d-flex justify-content-between"><span className='me-3'>Order no:</span> <span className='me-3'>{data.order_number}</span> <span> :  رقم الأمر</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Date:</span> <span className='me-3'>{data.date}</span> <span>    :تاريخ </span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Valid Date:</span> <span className='me-3'>{data.valid_date} </span> <span>  : تاريخ صالح </span>   </h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Delivery Date:</span> <span className='me-3'>{data.delivery_date} </span> <span>  : تاريخ التسليم </span>   </h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Payment Terms:</span> <span className='me-3'>{data.payment_terms} </span> <span>  : شروط الدفع </span>   </h6>
            </div>

        </div>}

        {name==='sales' && 
        <div className='d-flex justify-content-between mt-2 p-4' >

            <div className=' text-left'>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Name / الاسم:</span><span className='me-3'>{data.customer_info.name}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>VAT Number / رقم الضربية:</span><span className='me-3'>{data.customer_info.vat_number}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Contact / رقم الاتصال:</span><span className='me-3'>{data.customer_info.contact}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Address / الاسم:</span><span className='me-3'>{data.customer_info.address}</span></h6>
                
                

            </div>
            <div className=' text-left'>

                <h6 className="d-flex justify-content-between"><span className='me-3'>Invoive no:</span> <span className='me-3'>{data.invoice}</span> <span> : رقم الفاتورة</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Invoive Date:</span> <span className='me-3'>{data.date}</span> <span>    :تاريخ الفاتورة</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Payment Type:</span> <span className='me-3'>{data.payment_type} </span> <span>  :شروط الدفع </span>   </h6>
            </div>

        </div>}
        {name==='purchases' && 
        <div className='d-flex justify-content-between mt-2 p-4'>

            <div className=' text-left'>

                <h5 className="m-0">Supplier Details : تفاصيل العميل</h5>
                <h6 className="m-0">{data.supplier_name}</h6>
                
                

            </div>
            <div className=' text-left'>

                <h6 className="d-flex justify-content-between"><span className='me-3'>Invoive no:</span> <span className='me-3'>{data.invoice}</span> <span> : رقم الفاتورة</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Invoive Date:</span> <span className='me-3'>{data.date}</span> <span>    :تاريخ الفاتورة</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Payment Type:</span> <span className='me-3'>{data.payment_type} </span> <span>  :شروط الدفع </span>   </h6>
            </div>

        </div>}
        {name==='quotation' && 
        <div className='d-flex justify-content-between mt-2 p-4'>

            <div className=' text-left'>

                <h6 className="d-flex justify-content-between"><span className='me-3'>Name / الاسم:</span><span className='me-3'>{data.customer_info.name}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>VAT Number / رقم الضربية:</span><span className='me-3'>{data.customer_info.vat_number}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Contact / رقم الاتصال:</span><span className='me-3'>{data.customer_info.contact}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Address / الاسم:</span><span className='me-3'>{data.customer_info.address}</span></h6>
                
                

            </div>
            <div className=' text-left'>

                <h6 className="d-flex justify-content-between"><span className='me-3'>Quotation no:</span> <span className='me-3'>{data.quotation_number}</span> <span> : رقم الفاتورة</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Date:</span> <span className='me-3'>{data.date}</span> <span>    :تاريخ </span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Valid Date:</span> <span className='me-3'>{data.valid_date} </span> <span>  : تاريخ الصلاحية </span>   </h6>
            </div>

        </div>}

        {name==='delivery_notes' && 
        <div className='d-flex justify-content-between mt-2 p-4'>

            <div className=' text-left'>

                <h6 className="d-flex justify-content-between"><span className='me-3'>Name / الاسم:</span><span className='me-3'>{data.customer_info.name}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>VAT Number / رقم الضربية:</span><span className='me-3'>{data.customer_info.vat_number}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Contact / رقم الاتصال:</span><span className='me-3'>{data.customer_info.contact}</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Address / الاسم:</span><span className='me-3'>{data.customer_info.address}</span></h6>
                
                

            </div>
            <div className=' text-left'>

                <h6 className="d-flex justify-content-between"><span className='me-3'>Delivery no:</span> <span className='me-3'>{data.delivery_number}</span> <span> :  رقم التوصيل</span></h6>
                <h6 className="d-flex justify-content-between"><span className='me-3'>Date:</span> <span className='me-3'>{data.date}</span> <span>    :تاريخ </span></h6>
                
            </div>

        </div>}
        
        
        
        
     
                {name!=='delivery_notes' ? <div className='m-3 mb-0 mt-3 upper_wrapper' >    
                    <BootstrapTable
                    keyField="id"
                    data={ details }
                    columns={  columns_1 
                    }
                    bordered={false}
                    bootstrap4
                    condensed
                    classes='table_class'
                    
                    />
                </div>:
                <div className='m-3 mb-0 mt-3 upper_wrapper' >    
                <BootstrapTable
                keyField="id"
                data={ details }
                columns={  columns 
                }
                bordered={false}
                bootstrap4
                condensed
                classes='table_class_1'
                
                />
            </div>}
          
            <div className='m-3 mt-0  ps-2  d-flex   justify-content-between lower-main-div'>

                {name==='sales' && <div className='pt-3 ps-4 pb-3 pe-1 me-3'>
                <QRCode
                    
                    value={data.qr_code}
                    bgColor={'#FFFFFF'}
                    fgColor={'#000000'}
                    size={150}
                />

                </div>}
                
                <div className='pt-3 pe-1 text-start'>
                    
                        <h6><strong>Notes: </strong>{data.remarks}</h6>
                        {data.total && <h6><strong>SAR: { numberToWords.toWords(data.total).toUpperCase()}</strong></h6>}
                        {data.total && <h6><strong>{ toArabicWord(data.total)}</strong></h6>}
                </div>
                {name!=='delivery_notes' ? <div>
                    <div className=' d-flex'>
                        <h6 className='total m-0 p-1' style={{width:'120px'}}>مجموع اجمالي<br/>Total Gross</h6>
                        <h6 className='total m-0 p-2 text-center' style={{width:'150px'}} >{data.sub_total && data.sub_total.toFixed(2)}</h6>
                    </div>
                    <div className=' d-flex'>
                        <h6 className='total m-0 p-1' style={{width:'120px'}}>خصم<br/>Dicount</h6>
                        <h6 className='total m-0 p-2 text-center' style={{width:'150px'}} >{data.discount  && (parseFloat(data.discount)+parseFloat(data.extra_disc)).toFixed(2)}</h6>
                    </div>
                    <div className=' d-flex'>
                        <h6 className='total m-0 p-1' style={{width:'120px'}}>مجموع الضريبة<br/>TotalVAT</h6>
                        <h6 className='total  m-0 p-2 text-center' style={{width:'150px'}} >{data.vat_amount && data.vat_amount.toFixed(2)}</h6>
                    </div>
                    <div className=' d-flex'>
                        <h6 className='total_1 m-0 p-1' style={{width:'120px'}}>صافي اجمالي<br/>Grand Total</h6>
                        <h6 className=' m-0 p-2 text-center' style={{width:'150px'}} >{data.total && data.total.toFixed(2)}</h6>
                    </div>

                </div>:
                <div className=' d-flex'>
                <h6 className='total_1 m-0 p-1' style={{width:'120px'}}> إجمالي الكمية<br/>Total QTY</h6>
                <h6 className=' m-0 p-2 text-center' style={{width:'150px'}} >{quantity}</h6>
            </div>}

            </div>

            <hr className='mb-1'  style={{border:'2px solid #0d6efd' , borderRadius:'5px',opacity:'1'}}/>


            <div className=' mt-2 d-flex justify-content-between' style={{color:'#0d6efd'}}>
                <div className='col-sm-3 m-0 ms-2 me-1 ' >
                    <h6>
                    {company.address}
                    </h6>
                 
                </div>
                <div className='p-2 col-sm-5'>
                    <h6 className='m-0 text-center'>
                    VAT : {company.vat_number} <span className='text-dark'> | </span> C.R : {company.cr_number} 
                    </h6>
                    <h6 className='m-0 text-center'>
                     {company.email} 
                    </h6>
                    
                </div>
                <div className='col-sm-3 m-0 ms-1 me-2' >
                    <h6 className='text-end'>
                    {company.address_arabic}
                    </h6>
                    
                </div>
            </div>
            
        </div>}
    </div>
  )
}

export default Invoice_2