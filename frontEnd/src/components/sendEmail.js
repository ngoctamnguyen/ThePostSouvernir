import emailjs from '@emailjs/browser';

//Go to EmailJS to get 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', 'Publis key' and design template
//https://dashboard.emailjs.com/admin/templates/a18ofrf

export default function SendEmail(props, shop) {
  // eslint-disable-next-line no-useless-concat
  const myString = props.map((item, index) => +index + 1 + ': ' + item.Mahang + ' - ' + item.TenhangUnicode + ' : ' + '\t\t' + item.chenhLech).join('\n');
  const items = props.length
  //emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {Object displayed} , 'Publis key')
  emailjs.send('service_3prtoad', 'template_45a6hei', { name: shop ? shop : '', items: items, content: myString }, 'n7wM4ntlLPTuMWZG3')
    .then((result) => {
      alert('Chuyển email thàng công', result.text);
    }, (error) => {
      alert('Email sending failed:', error.text);
    });
}
