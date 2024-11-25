import React, { useState, useContext } from 'react';
import { Context } from '../context/Context';
import emailjs from '@emailjs/browser';

function EmailComponent() {
  const [dataArray] = useState([{mahang: '0010004', tenhang: 'be be'}, {mahang: '0010004', tenhang: 'be be'}, {mahang: '0010004', tenhang: 'be be'}]);
  const [message, setMessage] = useState('');
  const { user } = useContext(Context);

  const handleSubmit = (e) => {
    e.preventDefault();
    const myString = dataArray.map(item => 'Mã hàng:' + item.mahang + ' | Tên hàng: ' + item.tenhang).join('\n');
    //emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'Publis key')
    emailjs.send('service_3prtoad', 'template_45a6hei', {name: user.shop, age: 49, degree: 'Master', content: myString}, 'n7wM4ntlLPTuMWZG3')
      .then((result) => {
        console.log('Email sent successfully:', result.text);
      }, (error) => {
        console.error('Email sending failed:', error.text);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label >Số phiếu hủy:</label>
      <input type="text" id="sophieu" onChange={(e) => setMessage(e.target.value)} required />
      {false && <textarea id="message" name="message" value={message} />}
      <button type="submit">Gửi yêu cẩu hủy</button>
    </form>
  );
}

export default EmailComponent;
