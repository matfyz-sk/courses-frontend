import React from "react"
import MultipleSelectCheckmarks from "../common/MultipleSelectCheckmarks"
import { Box, Grid, TextField } from "@material-ui/core"
import DocumentsReferencer from "../common/DocumentsReferencer"
import { useGetTopicsQuery } from "../../../services/topic"
import { useGetDocumentReferencesByIdsQuery, useGetDocumentReferencesQuery } from "../../../services/documentsGraph";

export default function MaterialForm({ material, onMaterialChange, isReadOnly }) {
    const { description, covers, mentions, requires, isAlternativeTo, refersTo, generalizes } = material
    const { data: topics, isFetching } = useGetTopicsQuery()
    const { data: documentReferences } = useGetDocumentReferencesByIdsQuery(
        {
            documentReferenceIds: [
                ...isAlternativeTo.map(({ _id }) => _id),
                ...refersTo.map(({ _id }) => _id),
                ...generalizes.map(({ _id }) => _id),
            ],
        }
    )
    const isAlternativeToRefs = documentReferences?.filter(ref =>
        isAlternativeTo.map(({ _id }) => _id).includes(ref._id)
    ) ?? []
    const refersToRefs = documentReferences?.filter(ref => refersTo.map(({ _id }) => _id).includes(ref._id)) ?? []
    const generalizesRefs = documentReferences?.filter(ref => generalizes.map(({ _id }) => _id).includes(ref._id)) ?? []

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
                </Grid>
                <Grid container item spacing={2} xs={12} sm={6}>
                    <Grid style={{ textAlign: "center" }} item xs={12}>
                        Materials
                    </Grid>
                    <Grid item xs={12}>
                        <DocumentsReferencer
                            label="is an alternative to"
                            documentReferences={isAlternativeToRefs}
                            onDocumentReferencesChange={data => onMaterialChange({ isAlternativeTo: data })}
                            materialReferencer={true}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DocumentsReferencer
                            label="refers to"
                            documentReferences={refersToRefs}
                            onDocumentReferencesChange={data => onMaterialChange({ refersTo: data })}
                            materialReferencer={true}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DocumentsReferencer
                            label="generalizes"
                            documentReferences={generalizesRefs}
                            onDocumentReferencesChange={data => onMaterialChange({ generalizes: data })}
                            materialReferencer={true}
                            isReadOnly={isReadOnly}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <hr style={{ borderColor: "lightgray" }} />
        </>
    )
}
