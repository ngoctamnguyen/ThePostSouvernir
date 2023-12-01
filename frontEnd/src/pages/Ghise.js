import GhiseTableForm from "../components/tables/ghiseTableForm";
import '../App.css';


export default function Ghise() {
  return (
    <div className="tableDetail" style={{ width: '90%', height: '75%', marginLeft: '5%',backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
      <h3 className="banner">CASHIE</h3>
      <div>
        <GhiseTableForm />
      </div>

    </div>
  );
}