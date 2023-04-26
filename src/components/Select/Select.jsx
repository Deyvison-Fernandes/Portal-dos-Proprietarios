import React from 'react';
import { SelectInput, OptionsInput } from './styles';

const Select = ({ items, onChange }) => {
  if (!items) return null;
  const isAdmin = localStorage.getItem('is_admin');

  return (
    <SelectInput onChange={(e) => onChange(e)}>
      {!isAdmin && <OptionsInput value='0'>Todos</OptionsInput>}
      {items.map((item, ind) => (
        <OptionsInput value={item.descricao} key={`option-${ind}-${item}`}>
          {item.descricao}
        </OptionsInput>
      ))}
    </SelectInput>
  );
};

export default Select;
