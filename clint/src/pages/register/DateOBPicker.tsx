import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';

export default function CommonlyUsedComponents({userRegister, setUserRegister}: {userRegister: any, setUserRegister: (value: any) => void}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DatePicker',
        ]}
      >
        <DemoItem label="Add your date of birth">
          <DatePicker
            onChange={(date) => {
              if (date) {
                setUserRegister({...userRegister, dayOfBirth: date.toDate()});
              }
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
