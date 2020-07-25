export default ({children = 'Loading...'}) => <>
  <div className='loader-wrap'>
    <div className='loader' />
    <div>{children}</div>
  </div>
  <style jsx>{
    `.loader-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        background: #fff;
      }
      
      .loader {
        border: 2px solid #f3f3f3; /* Light grey */
        border-top: 2px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 16px;
        height: 16px;
        animation: spin 1s linear infinite;
        margin-right: 15px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
`
  }
  </style>
</>
