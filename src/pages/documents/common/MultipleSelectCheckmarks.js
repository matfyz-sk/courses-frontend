import React from 'react'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function MultipleSelectCheckmarks({
  allItems,
  items,
  setItems,
  label,
  isReadOnly,
}) {
  const handleChange = (event, values) => {
    setItems(values)
  }

  return (
    <div>
      <Autocomplete
        multiple
        id={label}
        options={allItems}
        getOptionLabel={item => item.name}
        getOptionSelected={(option, value) => option['_id'] === value['_id']}
        onChange={handleChange}
        value={items}
        style={{ width: '95%', border: '0', padding: '0', margin: 'auto' }}
        renderInput={params => (
          <TextField {...params} label={label} variant="outlined" />
        )}
        disabled={isReadOnly}
      />
    </div>
  )
}
