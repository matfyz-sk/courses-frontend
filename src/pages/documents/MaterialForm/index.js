import React from "react"
import MultipleSelectCheckmarks from "../common/MultipleSelectCheckmarks"
import { Box, Grid, TextField } from "@material-ui/core"
import DocumentsReferencer from "../common/DocumentsReferencer"
import { useGetTopicsQuery } from "../../../services/topic"

export default function MaterialForm({ material, onMaterialChange, isReadOnly }) {
    const { data: topics, isFetching } = useGetTopicsQuery()
    const { description, covers, mentions, requires, assumes, isAlternativeTo, refersTo, generalizes } = material
    if (isFetching) return <div></div>

    return (
        <>
            <hr style={{ borderColor: "lightgray" }} />
            <Box display="flex" alignItems="center" justifyContent="center">
                <TextField
                    id="description-textarea"
                    style={{ width: "50%" }}
                    label="Description"
                    multiline
                    variant="outlined"
                    value={description}
                    onChange={e => onMaterialChange({ description: e.target.value })}
                    disabled={isReadOnly}
                />
            </Box>
            <br />
            <h5 style={{ textAlign: "center" }}>Select the material's relations to other</h5>
            <Grid container spacing={3} style={{ width: "95%", margin: "auto" }}>
                <Grid container item spacing={2} xs={12} sm={6}>
                    <Grid style={{ textAlign: "center" }} item xs={12}>
                        Topics
                    </Grid>
                    <Grid item xs={12}>
                        <MultipleSelectCheckmarks
                            allItems={topics}
                            items={covers}
                            setItems={values => onMaterialChange({ covers: values })}
                            label={"covers"}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultipleSelectCheckmarks
                            allItems={topics}
                            items={mentions}
                            setItems={values => onMaterialChange({ mentions: values })}
                            label={"mentions"}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultipleSelectCheckmarks
                            allItems={topics}
                            items={requires}
                            setItems={values => onMaterialChange({ requires: values })}
                            label={"required"}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultipleSelectCheckmarks
                            allItems={topics}
                            items={assumes}
                            setItems={values => onMaterialChange({ assumes: values })}
                            label={"assumes mastery of"}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                </Grid>
                <Grid container item spacing={2} xs={12} sm={6}>
                    <Grid style={{ textAlign: "center" }} item xs={12}>
                        Materials
                    </Grid>
                    <Grid item xs={12}>
                        <DocumentsReferencer
                            label="is an alternative to"
                            documentReferences={isAlternativeTo}
                            onDocumentReferencesChange={data => onMaterialChange({ isAlternativeTo: data })}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DocumentsReferencer
                            label="refers to"
                            documentReferences={refersTo}
                            onDocumentReferencesChange={data => onMaterialChange({ refersTo: data })}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DocumentsReferencer
                            label="generalizes"
                            documentReferences={generalizes}
                            onDocumentReferencesChange={data => onMaterialChange({ generalizes: data })}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <hr style={{ borderColor: "lightgray" }} />
        </>
    )
}
