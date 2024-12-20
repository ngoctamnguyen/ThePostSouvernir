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
        height: 18,
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
  const [idItem, setIdItem] = useState('');
  const [priceItem, setPriceItem] = useState('');
  const [nameItem, setNameItem] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setIdItem(props.value ? props.value.maHang : '');
    setPriceItem(props.value ? props.value.Giaban : '');
    setNameItem(props.value ? props.value.tenHangUnicode : '')
  })
  return (
    <div>
      <MDBCol size='8'>
        <div style={{
          fontSize: "11px",
          width: '147px',
          height: '40.35px',
          border: '0px',
          paddingLeft: '-10px',
          paddingRight: '10px',
          marginLeft: '-10px',
          marginright: '10px',
          marginBottom: '9.5px',
        }} >
          <span style={{ marginLeft: '8px', marginBottom: '-20px', fontSize: "9px" }}>{priceItem.toLocaleString('en-US')}</span> {' '}
          <span
            style={{
              fontSize: "8px",
              marginBottom: '-7px',
              display: 'inline-block',
              width: '60px',
              height: '15px',
              overflow: 'hidden',
              textWrap: 'nowrap'
            }}>
            {nameItem}
          </span>
          <span
            style={{
              fontSize: "9px",
            }}>
            {idItem && <Barcode value={idItem} format="CODE128" />}
          </span>
        </div>
      </MDBCol>
    </div>
  )
}


