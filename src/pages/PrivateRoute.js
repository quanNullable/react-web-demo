import router from 'umi/router';

export default (props) => {
  if(!props.location.query||!props.location.query.from){
    router.reder('/')
    return <div> no permission</div>
  }
  return (
    <div>
      { props.children }
    </div>
  );
}