import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
const icons = {
  'todo': 'assignment',
  'in-progress': 'autorenew',
  'done': 'assignment_turned_in',
  'deleted': 'delete',
  'canceled': 'cancel'
}
const colors = {
  'todo': 'grey',
  'in-progress': 'blue',
  'done': 'green',
  'deleted': 'red',
  'canceled': 'black'
}
export default ({ children, status }) => {
  return (
    <>
      <li className="task-list__item">
        <Icon style={{ color: colors[status], margin: 'auto 4px auto 0px' }}>{icons[status]}</Icon>
        <p className="title">{children}</p>
        <div className="btn-group">
          <Button type="button" color="primary">Start</Button>
          <Button type="button" color="secondary">Done</Button>
          <Button type="button">Cancel</Button>
          <Button type="button">Delete</Button>
        </div>
      </li>
      <style jsx>{
        `
        .task-list__item {
          padding: 4px 8px;
          margin: 2px 0px;
          display: flex;
          background: #fff;
        }
        .title {
          flex: 1;
          margin: auto 0;
        }
        .btn-group {
          display: flex;
        }
        `
      }</style>
    </>
  )
}