import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Field, FieldArray, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React from "react";
import { array, boolean, number, object, string, ValidationError } from "yup";

const emptyDonation = { institution: "", percentage: 0 };
const useStyles = makeStyles((theme) => ({
  errorColor: {
    color: theme.palette.error.main,
  },
  noWrap: {
    [theme.breakpoints.up("sm")]: {
      flexWrap: "nowrap",
    },
  },
}));

{/*Pausa de 3 segundos antes de poder enviar novamente*/}
export default function App() {
  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Formik
          initialValues={{
            firstName: "",
            secondName: "",
            over18: false,
            donationsAmount: 0,
            termsAndConditions: false,
            donations: [emptyDonation],
          }}
          /*Validação*/
          validationSchema={object({
            firstName: string()
              .required("Seu nome é necessário.")
              .min(2, "Seu nome precisa ter, no mínimo, 2 caracteres.")
              .max(10, "Seu nome precisa ter, no máximo, 30 caracteres."),
            secondName: string()
              .required("Seu sobrenome é necessário.")
              .min(2, "Seu sobrenome precisa ter, no mínimo, 2 caracteres.")
              .max(100, "Seu sobrenome precisa ter, no máximo, 100 caracteres."),
            over18: boolean().required().isTrue(),
            donationsAmount: number().required().min(10),
            termsAndConditions: boolean().required().isTrue(),
            /*Validação do Array*/
            donations: array(
              object({
                institution: string()
                  .required("O nome da instituição é necessário.")
                  .min(3, "O nome da instituição precisa ter, no mínimo, 2 caracteres.")
                  .max(
                    10,
                    "O nome da instituição precisa ter, no máximo, 30 caracteres."
                  ),
                percentage: number()
                  .required("A porcentagem da doação é necessária.")
                  .min(0.01, "A porcentagem precisa ser, no mínimo, 1%.")
                  .max(100, "A porcentagem precisa ser, no máximo, 100%."),
              })
            )
              .min(1, "É preciso adicionar, no mínimo, 1 instituição.")
              .test((donations) => {
                const sum = donations?.reduce(
                  (acc, curr) => acc + (curr.percentage || 0),
                  0
                );

                if (sum !== 100) {
                  return new ValidationError(
                    `A soma das porcentagens precisa ser igual a 100%, mas o valor da soma é ${sum}%`,
                    undefined,
                    "donations"
                  );
                }

                return true;
              }),
          })}
          /*Pausa de 3 segundos antes de poder enviar novamente*/
          onSubmit={async (values) => {
            console.log("my values", values);
            return new Promise((res) => setTimeout(res, 3000));
          }}
        >
          {({ values, errors, isSubmitting, isValid }) => (
            <Form autoComplete="off">
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Field
                    fullWidth
                    name="firstName"
                    component={TextField}
                    label="Nome"
                  />
                </Grid>

                <Grid item>
                  <Field
                    fullWidth
                    name="secondName"
                    component={TextField}
                    label="Sobrenome"
                  />
                </Grid>

                <Grid item>
                  <Field
                    name="over18"
                    type="checkbox"
                    component={CheckboxWithLabel}
                    Label={{
                      label: "Sou maior de 18 anos.",
                      className: errors.over18
                        ? classes.errorColor
                        : undefined,
                    }}
                  />
                </Grid>

                <Grid item>
                  <Field
                    fullWidth
                    name="donationsAmount"
                    type="number"
                    component={TextField}
                    label="Doação (R$)"
                  />
                </Grid>

                {/*
                Field Array - Formik
                Push - Colocar no final do array
                Remove - Remover pelo index
                */}
                <FieldArray name="donations">
                  {({ push, remove }) => (
                    <React.Fragment>
                      <Grid item>
                        <Typography variant="body2">
                          Todas as doações
                        </Typography>
                      </Grid>

                      {values.donations.map((_, index) => (
                        <Grid
                          container
                          item
                          className={classes.noWrap}
                          key={index}
                          spacing={2}
                        >
                          <Grid item container spacing={2} xs={12} sm="auto">
                            <Grid item xs={12} sm={6}>
                              <Field
                                fullWidth
                                name={`donations.${index}.institution`}
                                component={TextField}
                                label="Instituição"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Field
                                fullWidth
                                name={`donations[${index}].percentage`}
                                component={TextField}
                                type="number"
                                label="Porcentagem (%)"
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm="auto">
                            <Button
                              disabled={isSubmitting}
                              onClick={() => remove(index)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      ))}

                      <Grid item>
                        {typeof errors.donations === "string" ? (
                          <Typography color="error">
                            {errors.donations}
                          </Typography>
                        ) : null}
                      </Grid>

                      <Grid item>
                        <Button
                          disabled={isSubmitting}
                          variant="contained"
                          onClick={() => push(emptyDonation)}
                        >
                          Adicionar doação
                        </Button>
                      </Grid>
                    </React.Fragment>
                  )}
                </FieldArray>

                <Grid item>
                  <Field
                    name="termsAndConditions"
                    type="checkbox"
                    component={CheckboxWithLabel}
                    Label={{
                      label: "Eu aceito os termos e condições.",
                      className: errors.termsAndConditions
                        ? classes.errorColor
                        : undefined,
                    }}
                  />
                </Grid>

                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size="0.9rem" />
                      ) : undefined
                    }
                  >
                    {/*Botão desativa enquanto está "Submitting" (3 segundos)*/}
                    {isSubmitting ? "Enviando" : "Enviar"}
                  </Button>
                </Grid>
              </Grid>

              <pre>{JSON.stringify({ values, errors }, null, 4)}</pre>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
