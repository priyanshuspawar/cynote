import React from 'react'
import CustomDialogTrigger from '../global/customDialogTrigger'
import SettingsForm from './settings-form';

type SettingsProps = {
    children: React.ReactNode;
}

const Settings = ({children}: SettingsProps) => {
  return (
    <CustomDialogTrigger
    header='Settings'
    content={<SettingsForm/>}
    >
        {children}
    </CustomDialogTrigger>
  )
}

export default Settings