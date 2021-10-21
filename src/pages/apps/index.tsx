import React, { useEffect, useState, useMemo, useContext } from 'react'
import { Container, Box, Button, Typography, Stepper, Step, StepLabel } from '@material-ui/core'
import { Context, EnrichedPostageBatch } from '../../providers/Stamps'
import { beeApi } from '../../services/bee'
import { useSnackbar } from 'notistack'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import CreatePostageStampModal from '../stamps/CreatePostageStampModal'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DeleteIcon from '@material-ui/icons/Delete'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import PeerDetailDrawer from '../../components/PeerDetail'
import ClipboardCopy from '../../components/ClipboardCopy'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { useStatusNodeVersion } from '../../hooks/status'
import semver from 'semver'

type FileArrayType = { file: File; name: string; size: string }[]

type stampType = {
  usage: number
  usageText: string
  usable: boolean
  [propsName: string]: any
}

const activeStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#4086e0',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

const steps = ['Select File', 'Select Postage Stamps', 'Upload Package', 'Completed']

const useStyles = makeStyles(theme =>
  createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210,
    },
    drap: {
      color: 'red',
    },
    boxRoot: {
      margin: '28px auto 18px',
    },
    dragoneRoot: {
      width: '100%',
      minHeight: '120px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      borderWidth: 2,
      borderRadius: 2,
      //   borderColor: '#424242',
      borderStyle: 'dashed',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      color: '#bdbdbd',
      outline: 'none',
      transition: 'border .24s ease-in-out',
    },

    filesList: {
      margin: '18px 0',
      listStyle: 'none',
      padding: 0,
    },
    tips: {
      backgroundColor: '#4086e0',
      padding: '12px',
      marginTop: '24px',
    },
  }),
)

const formatSize = (size: number) => {
  const _size = size / 1024

  return _size > 1000 ? (_size / 1000).toFixed(2) + 'M' : _size + 'KB'
}

export default function AppMarkplace() {
  const [files, setFiles] = useState<FileArrayType | null>(null)
  const [uploadReference, setUploadReference] = useState('')
  const [selectedStamp, setSelectedStamp] = useState<EnrichedPostageBatch | null>(null)

  const { isLoading, error, stamps } = useContext(Context)

  const [openConfirm, setOpenConfirm] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const { enqueueSnackbar } = useSnackbar()

  const classes = useStyles()

  const { userVersion } = useStatusNodeVersion()

  const isGt1_3_0_version = useMemo(() => {
    return userVersion ? semver.gt(userVersion, '0.1.3') : false
  }, [userVersion])

  useEffect(() => {
    if (!selectedStamp && stamps && stamps.length > 0) {
      const stamp = stamps.reduce((prev, curr) => {
        if (curr.usage < prev.usage) return curr

        return prev
      }, stamps[0])

      setSelectedStamp(stamp)
    }
  }, [isLoading, error, stamps, selectedStamp])

  const deleteRemove = (i: number) => {
    setFiles(null)
  }

  const uploadCallback = (hash: any) => {
    const t = setTimeout(() => {
      clearTimeout(t)
      setUploadReference(String(hash))
      setActiveStep(4)
      setOpenConfirm(false)
      setFiles(null)
    }, 0)
    enqueueSnackbar(`Upload successful`, { variant: 'success' })
  }

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxSize: 52428800,
    maxFiles: 1,
    disabled: !isGt1_3_0_version,
    accept: ['application/x-tar', 'application/zip', 'application/x-zip', 'application/x-zip-compressed'],
  })

  const activeDragoneClass = useMemo(
    () => ({
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  )

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setActiveStep(1)
      setUploadReference('')
      setFiles(acceptedFiles.map((file: File) => ({ name: file.name, size: formatSize(file.size), file })))
    }
  }, [acceptedFiles])

  const isNoStamps = useMemo(() => {
    if (!stamps) return true

    return stamps.length > 0 ? false : true
  }, [stamps])

  const dySteps = useMemo(() => {
    const _dySteps = [...steps]

    if (isNoStamps) {
      _dySteps[1] = 'Buy Postage Stamp'

      return _dySteps
    }

    return _dySteps
  }, [stamps, isNoStamps])

  return (
    <>
      <Container>
        <Box>
          <Typography variant="h4" gutterBottom>
            Web Site Hosting
          </Typography>
          <Typography variant="subtitle1">
            The SANA network supports hosting your website by simply uploading the packaged site resources to the SANA
            node to complete the deployment of your website.（Only version 0.1.4 and above are supported）
          </Typography>
        </Box>
        <Box className={classes.tips}>
          <Typography variant="subtitle1">
            Tip: Hosted packages require you to use a domain name resolution tool (e.g. https://cloudflare.com) to
            resolve the domain name after upload.
          </Typography>
          <Typography>
            <div>{`1、CNAME -> gateway.ethsana.org`}</div>
            <div>{`2、TXT   -> sana://hash`}</div>
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }} className={classes.boxRoot}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {dySteps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box>
          <div
            {...getRootProps({ className: classes.dragoneRoot })}
            style={{ ...activeDragoneClass, cursor: isGt1_3_0_version ? 'pointer' : 'not-allowed' }}
          >
            <input {...getInputProps()} />
            {isGt1_3_0_version ? (
              <>
                <Typography variant="subtitle1">{`Drag \'n\' drop a file here, or click to select file`}</Typography>
                <em style={{ color: isDragReject ? '#ff1744' : 'inherit' }}>
                  (Only *.zip, *.tar files are supported and under 50M in size )
                </em>
              </>
            ) : (
              <Typography style={{ color: '#ff1744' }}>Only version 0.1.4 and above are supported</Typography>
            )}
            <CloudUploadIcon fontSize="large" />
          </div>
          <ul className={classes.filesList}>
            {files &&
              files.map(({ name, size }, index) => (
                <li key={name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{`Selected File: ${name}`}</span>
                    <span style={{ width: '24px', display: 'inline-block' }} />
                    <span>{size}</span>
                    <span style={{ width: '24px', display: 'inline-block' }} />
                    <Button onClick={() => deleteRemove(index)}>
                      <DeleteIcon />
                    </Button>
                  </Typography>
                  {isNoStamps ? (
                    <CreatePostageStampModal />
                  ) : (
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() => {
                        setOpenConfirm(true)
                      }}
                    >
                      Select Postage Stamp
                    </Button>
                  )}
                </li>
              ))}
          </ul>
          {fileRejections && fileRejections.length > 0 && (
            <ul className={classes.filesList}>
              {fileRejections &&
                fileRejections.map(({ file, errors }) => (
                  <li key={file.name} style={{ color: 'red' }}>
                    <Typography style={{ display: 'flex', alignItems: 'center' }}>
                      <span>{`Unsupported File: ${file.name}`}</span>
                      <span style={{ width: '24px', display: 'inline-block' }} />
                    </Typography>
                    <Typography style={{ fontSize: '13px' }}>{`Reason: ${errors[0].message}`}</Typography>
                  </li>
                ))}
            </ul>
          )}
        </Box>
        {/* {uploadReference && (
          <Box style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>File Hash:</Typography>
              <PeerDetailDrawer peerId={uploadReference} characterLength={12} />
              <ClipboardCopy value={uploadReference} />
            </div>
            <span style={{ color: '#32c48d' }}>Upload Successful</span>
          </Box>
        )} */}
        {uploadReference && (
          <TableContainer component={Paper}>
            <Table aria-label="sana table">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Content</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    CNAME
                  </TableCell>
                  <TableCell align="right">www</TableCell>
                  <TableCell align="right">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <span>gateway.ethsana.org</span>
                      <ClipboardCopy value="gateway.ethsana.org" />
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    TXT
                  </TableCell>
                  <TableCell align="right">www</TableCell>
                  <TableCell align="right">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <span> {`sana://${uploadReference.substr(0, 10)}...${uploadReference.substr(-10)}`}</span>
                      <ClipboardCopy value={`sana://${uploadReference}`} />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
      <ConfirmationDialogRaw
        open={openConfirm}
        stamps={stamps}
        file={files ? files[0].file : undefined}
        onClose={() => {
          setOpenConfirm(false)
        }}
        setStep={(step: number) => {
          setActiveStep(step)
        }}
        callback={uploadCallback}
      />
    </>
  )
}

function ConfirmationDialogRaw({
  open,
  stamps,
  file,
  onClose,
  callback,
  setStep,
}: {
  open: boolean
  file: File | undefined
  stamps: stampType[] | null
  onClose: () => void
  setStep: (n: number) => void
  callback?: (hash: any) => void
}) {
  const [uploading, setLoading] = useState(false)
  const [selectedStamp, setSelectedStamp] = useState<stampType | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const handleRadio = (event: any) => {
    if (stamps && stamps.length > 0) {
      const index = stamps?.findIndex(st => st?.batchID === event?.target?.value)
      setSelectedStamp(index > -1 ? stamps[index] : null)
      setStep(2)
    }
  }

  const uploadFile = () => {
    if (!file || selectedStamp === null) return
    setLoading(true)

    beeApi.files
      .uploadFilePkg(selectedStamp?.batchID, file)
      .then(hash => {
        if (callback && typeof callback === 'function') {
          callback(hash)
        }
      })
      .catch(e => {
        enqueueSnackbar(`Error uploading: ${e.message}`, { variant: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog aria-labelledby="confirmation-dialog-title" open={open} maxWidth="sm">
      <DialogTitle id="confirmation-dialog-title">Upload confirmation</DialogTitle>
      <DialogContent dividers>
        <em>Uploading resources to the SANA network will consume stamps, please select a stamp.</em>
        <div style={{ height: '10px' }} />
        {stamps ? (
          <RadioGroup value={selectedStamp?.batchID} onChange={handleRadio}>
            {[...stamps].map(item => (
              <FormControlLabel
                value={item?.batchID}
                key={item?.batchID}
                control={<Radio color="primary" disabled={!item?.usable} />}
                label={
                  <div
                    style={{ display: 'flex', width: '520px', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <PeerDetailDrawer peerId={item.batchID} characterLength={12} />
                    <Typography
                      variant="button"
                      style={{
                        fontFamily: 'monospace, monospace',
                        color: item.usable ? '#4086e0' : '#ff1744',
                      }}
                    >
                      <em>{`usage: ${item?.usageText}`}</em>
                    </Typography>
                  </div>
                }
              />
            ))}
          </RadioGroup>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" disabled={!selectedStamp || uploading} onClick={uploadFile}>
          {uploading ? 'Upload...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
