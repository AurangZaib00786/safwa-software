import React from 'react'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';

function Save_button(props) {
  const {t} = useTranslation()
  return (
    <Button  type='submit' variant='outline-primary'  >{props.isloading && <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />}<SaveIcon/>  {t('save')}</Button>
  )
}

export default Save_button