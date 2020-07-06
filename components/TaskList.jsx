export default ({ children }) => {
  return (
    <>
      <ul className="task-list">
        {children}
      </ul>
      <style jsx>{
        `.task-list {
          border: 0;
          padding: 5px;
          margin: 0;
          border-radius: 2px;
          background: #f0f0f0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
        }`
      }</style>
    </>
  )
}