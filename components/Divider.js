export default ({children}) => {
  return (
    <>
      <div className="divider__container">
        <div className="divider__border" />
        <span className="divider__content">{children}</span>
        <div className="divider__border" />
      </div>
      <style jsx>{
        `
        .divider__container{
          display: flex;
          align-items: center;
          color: #ccc;
          margin: 20px 0;
        }
        
        .divider__border{
          border-bottom: 1px solid #ccc;
          width: 100%;
        }
        
        .divider__content {
          padding: 0 10px 0 10px;
        }
        `
      }</style>
    </>
  )
}
