
import rpcna from './api/rpcna.json'

function App() {

const display = rpcna.map(cong => <h2 key={cong.id}>{cong.name}</h2>)



  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Hello World</h1>
      {display}
    </div>
  );
}

export default App;
