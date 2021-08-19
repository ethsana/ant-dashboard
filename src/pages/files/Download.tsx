import { ReactElement, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Paper, InputBase, IconButton, FormHelperText } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { apiHost } from '../../constants'
import { Utils } from '@ethersana/ant-js'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0.25),
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
)

export default function Files(): ReactElement {
  const classes = useStyles()
  const [referenceInput, setReferenceInput] = useState('')
  const [referenceError, setReferenceError] = useState<Error | null>(null)

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReferenceInput(e.target.value)

    if (Utils.Hex.isHexString(e.target.value, 64) || Utils.Hex.isHexString(e.target.value, 128)) setReferenceError(null)
    else setReferenceError(new Error('Incorrect format of sana hash'))
  }

  const handleKeyEvent = (key: string) => {
    if (!referenceError && key === 'enter') {
      window.open(`${apiHost}/bzz/${referenceInput}`)
    }
  }

  return (
    <>
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Enter sana reference e.g. 7e078b0676b034a35d41e766e804551ae5ddd80182329c6a7fff3035dab9cd52"
          inputProps={{ 'aria-label': 'retrieve file from sana' }}
          value={referenceInput}
          onChange={handleReferenceChange}
          onKeyUp={e => {
            handleKeyEvent(e.key.toLocaleLowerCase())
          }}
        />
        <IconButton
          href={`${apiHost}/bzz/${referenceInput}`}
          target="_blank"
          disabled={referenceError !== null || !referenceInput}
          className={classes.iconButton}
          aria-label="download"
        >
          <Search />
        </IconButton>
      </Paper>
      {referenceError && <FormHelperText error>{referenceError.message}</FormHelperText>}
    </>
  )
}
