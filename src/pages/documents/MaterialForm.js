import React, { useState, useEffect } from 'react'
import MultipleSelectCheckmarks from './common/MultipleSelectCheckmarks'
import { axiosGetEntities, getResponseBody } from 'helperFunctions'
import { Box, Grid, TextField } from '@material-ui/core'
import DocumentsReferencer from './common/DocumentsReferencer'

export default function MaterialForm({
  description,
  setDescription,
  handleLoading,
  statusHandler,
  isAlternativeTo,
  setIsAlternativeTo,
  refersTo,
  setRefersTo,
  generalizes,
  setGeneralizes,
  covers,
  setCovers,
  mentions,
  setMentions,
  requires,
  setRequires,
  assumes,
  setAssumes,
}) {
  const [topics, setTopics] = useState([])

  useEffect(() => {
    handleLoading(true)
    // const topicsUrl = `topic?courseInstance=${courseId}`
    axiosGetEntities('topic').then(response => {
      if (response.failed) {
        statusHandler(response.response ? response.response : 500)
        return
      }
      setTopics(getResponseBody(response))
      handleLoading(false)
    })
  }, [])

  return (
    <>
      <hr style={{ borderColor: 'lightgray' }} />
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          id="description-textarea"
          style={{ width: '50%' }}
          label="Description"
          multiline
          variant="outlined"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </Box>
      <br />
      <h5 style={{ textAlign: 'center' }}>
        Select the material's relations to other
      </h5>
      <Grid container spacing={3} style={{ width: '95%', margin: 'auto' }}>
        <Grid style={{ textAlign: 'center' }} item xs={6}>
          Topics
        </Grid>
        <Grid style={{ textAlign: 'center' }} item xs={6}>
          Materials
        </Grid>
        <Grid item xs={6}>
          <MultipleSelectCheckmarks
            allItems={topics}
            items={covers}
            setItems={setCovers}
            label={'covers'}
          />
        </Grid>
        <Grid item xs={6}>
          <DocumentsReferencer
            label="is an alternative to"
            documentReferences={isAlternativeTo}
            onDocumentReferencesChange={setIsAlternativeTo}
          />
        </Grid>
        <Grid item xs={6}>
          <MultipleSelectCheckmarks
            allItems={topics}
            items={mentions}
            setItems={setMentions}
            label={'mentions'}
          />
        </Grid>
        <Grid item xs={6}>
          <DocumentsReferencer
            label="refers to"
            documentReferences={refersTo}
            onDocumentReferencesChange={setRefersTo}
          />
        </Grid>
        <Grid item xs={6}>
          <MultipleSelectCheckmarks
            allItems={topics}
            items={requires}
            setItems={setRequires}
            label={'required'}
          />
        </Grid>
        <Grid item xs={6}>
          <DocumentsReferencer
            label="generalizes"
            documentReferences={generalizes}
            onDocumentReferencesChange={setGeneralizes}
          />
        </Grid>
        <Grid item xs={6}>
          <MultipleSelectCheckmarks
            allItems={topics}
            items={assumes}
            setItems={setAssumes}
            label={'assumes mastery of'}
          />
        </Grid>
      </Grid>
      <hr style={{ borderColor: 'lightgray' }} />
    </>
  )
}
