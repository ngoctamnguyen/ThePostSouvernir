import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { MDBCol } from 'mdb-react-ui-kit';
import JsBarcode from 'jsbarcode';

const Barcode = ({ value, format }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      JsBarcode(canvasRef.current, value, {
        format: format,
        displayValue: true,
        width: 1,
        height: 20,
        fontSize: 11,
        textMargin: 0,
        marginTop: '-2px',
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
      });
    }
  }, [value, format]);
  return <canvas ref={canvasRef} />;
};

export default function PrintBarcode(props) {
  const [idItem, setIdItem] = useState('0');
  const [priceItem, setPriceItem] = useState('0')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setIdItem(props.value ? props.value.maHang : '');
    setPriceItem(props.value ? props.value.Giaban : '')
  })
  return (
    <div>
      <MDBCol size='8'>
        <div style={{
          fontSize: "17px",
          width: '30px',
          border: '0px',
          padding: '0px',
          marginLeft: '6px',
          marginBottom: '-5px'
        }} >
          <span >{priceItem}</span>
        </div>
        {idItem && <Barcode value={idItem} format="CODE128" />}
      </MDBCol>

    </div>
  )
}


