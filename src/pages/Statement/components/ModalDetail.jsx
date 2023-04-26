import { useEffect } from 'react';
import { useState } from 'react';
import { Text } from '../../../styles';
import './style.css';

const ModalDetail = (props) => {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props]);

  const header = [
    'Data',
    'PDV',
    'Item',
    'Qtd',
    'Valor',
    'Valor bruto',
    'Desconto',
    'Valor líquido'
  ];

  return (
    <table className='table-detail' id='statement'>
      <thead style={{ textAlign: 'left' }}>
        <tr>
          {header.map((h, ind) => (
            <th key={`th-${ind}`}>
              <Text size='13px'>{h}</Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, ind) => (
          <tr key={`${item}-${ind}`}>
            {Object.keys(item).map((key, index) => (
              <td key={`td-${index}`}>
                <Text size='11px'>{item[key]}</Text>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default ModalDetail;
