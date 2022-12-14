import React, { Fragment } from 'react';
import TextField from "@mui/material/TextField";
import MFormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {BaseFormControl} from '@manojadams/metaforms-core';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { IRenderField } from '@manojadams/metaforms-core/dist/constants/common-interface';
import enLocale from 'date-fns/locale/en-US';
import { Button, Checkbox, FormGroup, FormHelperText } from '@mui/material';
import MuiSearch from './Search';
import { MandatoryLabel } from "@manojadams/metaforms-core/dist/core/form-controls/common";
import FormUtils from '@manojadams/metaforms-core/dist/utils/FormUtil';
import { MSGS } from '@manojadams/metaforms-core/dist/constants';

export default class FormControl extends BaseFormControl {
    variant: string;
    size: any;
    constructor(props: IRenderField){
        super(props);
        this.variant = 'standard';
    }
    render(): JSX.Element {
        const muiVariant = this.context.getThemeProp('mui','variant');
        const muiSize = this.context.getThemeProp('mui','size');
        this.variant = muiVariant ? muiVariant : 'standard';
        this.size = muiSize ? muiSize : undefined;
        return super.render();
    }
    getVariant() {
        return this.field.meta?.mui?.variant ? this.field.meta.mui.variant : this.variant;
        
    }
    getDisplayLabel() {
        return this.props.form.validation?.required ? this.props.form.displayName + ' *' : this.props.form.displayName;
    }
    label() {
        const meta = this.props.form;
        const fieldClassName = meta?.displayProps?.fieldLayout === 'row' ? 'd-md-flex flex-md-row justify-content-md-between': '';
        const wrapperClassName = 'meta-form-control-' + this.field.name + ' '+ fieldClassName;
        let hasStartIcon = false;
        let hasEndIcon = false;
        let startIcon = <Fragment></Fragment>;
        let endIcon = <Fragment></Fragment>;
        if (this.props.form.icons) {
            const allIcons = Object.keys(this.props.form.icons);
            allIcons && allIcons.forEach(icon => {
                const actualIcon = this.props.form.icons && this.props.form.icons[icon] ? this.props.form.icons[icon] : undefined;
                if (actualIcon?.type === 'start') {
                    hasStartIcon = true;
                    startIcon = this.context.getIcon(actualIcon.type);
                }
                if (hasEndIcon = actualIcon?.type === 'end') {
                    hasEndIcon = true;
                    endIcon = this.context.getIcon(icon);
                }
            });
        }
        return (
            <MFormControl size={this.size} fullWidth className={wrapperClassName}>
                <FormLabel className='field-label'>{meta.displayName}</FormLabel>
                <span className='field-value'>
                    {hasStartIcon && startIcon}
                    {meta.value}
                    {hasEndIcon && endIcon}
                </span>
            </MFormControl>
        )
    }
    date(props?: any) {
        const label = this.getDisplayLabel();
        const dateString = this.props.form?.value ?  this.props.form.value + '' : ''; 
        let value = this.props.form?.value? new Date(dateString) : null;
        const variant = this.getVariant();
        const min = this.props.form.validation?.min? new Date(this.props.form.validation.min) : undefined;
        const max = this.props.form.validation?.max? new Date(this.props.form.validation.max) : undefined;
        const openTo = this.props.form?.config?.openTo || undefined;
        const inputFormat = this.props.form?.config?.inputFormat || "dd/MM/yyyy";
        const views = this.props.form?.config?.views || undefined;
        const subProps = props ? props : {};
        let localValue = undefined;
        const wrapperClassName = 'meta-form-control-' + this.field.name;
        const placeholder = this.props.form.placeholder || inputFormat;
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
                <DatePicker
                    {...subProps}
                    disabled={this.props.form.isDisabled}
                    readOnly={this.props.form.isReadonly}
                    label={label}
                    value={localValue || value}
                    views={views}
                    openTo={openTo}
                    inputFormat={inputFormat}
                    minDate={min}
                    maxDate={max}
                    PopperProps={{
                        className: 'meta-form-date-picker'
                    }}
                    onChange={(val: Date | null, inputString: string) => {
                        if (val === null && inputString === undefined) {
                            // input field is cleared
                            this.handleChange(null, '');
                        } else if (inputString === undefined) {
                            // popup is used
                            if (val) {
                                this.handleChange(null, FormUtils.getDateString(val));
                            } else {
                                this.handleChange(null, '');
                            }
                        } else {
                            // input field is used
                            // check input format
                            if (val && inputString && inputString.length === inputFormat.length) {
                                const inputDate = Date.parse(inputString);
                                if (isNaN(inputDate)) {
                                    this.setError(true, MSGS.ERROR_MSG.DATE_INVALID);
                                } else {
                                    this.handleChange(null, FormUtils.getDateString(new Date(inputDate)));
                                }
                            } else {
                                localValue = val;
                            }
                        }
                    }}
                    onClose={this.handleValidation.bind(this)}
                    renderInput={(params) => <TextField {...params} variant={variant}
                        className={wrapperClassName}
                        helperText={this.state.error.errorMsg||undefined} 
                        inputProps={{
                            ...params.inputProps,
                            placeholder: placeholder
                        }}
                        onBlur={this.handleValidation.bind(this)}
                        size={this.size}
                        error={this.state.error?.hasError?true:undefined} fullWidth/>}
                />
            </LocalizationProvider>
        ) 
    }
    month() {
        const dateString = this.props.form?.value ?  this.props.form.value + '' : ''; 
        let value = this.props.form?.value? new Date(dateString) : null;
        const label = this.getDisplayLabel();
        const variant = this.getVariant();
        const max = this.props.form.validation?.max? new Date(this.props.form.validation.max) : undefined;
        const min = this.props.form.validation?.min? new Date(this.props.form.validation.min) : undefined;
        const wrapperClassName = 'meta-form-control-' + this.field.name;
        const inputFormat = 'MMM yyyy';
        const placeholder = this.props.form.placeholder || inputFormat;
        let localValue = undefined;
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
                <DatePicker
                    label={label}
                    openTo="year"
                    views={["year", "month"]}
                    value={localValue || value}
                    inputFormat={inputFormat}
                    minDate={min}
                    maxDate={max}
                    PopperProps={{
                        className: 'meta-form-date-picker'
                    }}
                    onChange={(val, inputString) => {
                        if (inputString) {
                            if (inputString.length >= 8) {
                                const dateValue = Date.parse(inputString);
                                if (!isNaN(dateValue)) {
                                    const dateString = FormUtils.getDateString(new Date(dateValue));
                                    this.handleChange(null, dateString);
                                } else {
                                    localValue = inputString;
                                }
                            } else {
                                localValue = inputString;
                            }
                        } else {
                            if (val) {
                                const isNan = isNaN(val.getTime());
                                if (isNan) {
                                    localValue = val;
                                } else {
                                    localValue = undefined;
                                    const dateString = FormUtils.getDateString(val);
                                    this.handleChange(null, dateString);
                                }
                            } else {
                                this.handleChange(null, '');
                            }
                        }
                    }}
                    onClose={this.handleValidation.bind(this)}
                    renderInput={(params) => 
                        <TextField {...params} 
                            className={wrapperClassName}
                            variant={variant}
                            helperText={this.state.error.errorMsg||undefined} 
                            placeholder={this.props.form.placeholder}
                            inputProps={{
                                ...params.inputProps,
                                placeholder: placeholder
                            }}
                            onBlur={this.handleValidation.bind(this)}
                            size={this.size}
                            error={this.state.error?.hasError?true:undefined}
                            fullWidth/>}
                />
            </LocalizationProvider>
        ) 
    }
    input(type: string, props?: any) {
        const label = this.getDisplayLabel();
        const variant = this.getVariant();
        const infoText = this.props.form?.validation?.info_detail?.infoMsg;
        const wrapperClassName = 'meta-form-control-' + this.field.name;
        const extraProps = props || {};
        // const max
        return (
            <TextField className={wrapperClassName}
                type={type} label={label} variant={variant} fullWidth
                disabled={this.props.form.isDisabled}
                inputProps={{
                    readOnly: this.props.form.isReadonly,
                    ...extraProps
                }}
                placeholder={this.props.form?.placeholder}
                value={this.props.form?.value}
                error={this.state.error?.hasError?true:undefined}
                helperText={this.state.error.errorMsg||infoText||undefined}
                onChange={this.handleChange.bind(this)}
                onBlur={this.handleValidation.bind(this)}
                size={this.size}
            />
        )
    }
    text() {
        const maxLength = this.props.form.validation?.max || '';
        let extraProps;
        if (maxLength) {
            extraProps = {
                maxLength: maxLength
            }
        }
        return this.input('text', extraProps);
    }
    password() {
        return this.input('password');
    }
    email() {
        return this.input('email');
    }
    number() {
        return this.input('number');
    }
    radio() {
        const meta = this.props.form;
        const isRow = this.props.form?.displayProps?.optionsLayout === 'row' ? true : undefined;
        const wrapperClassName = 'meta-form-control-' + this.field.name
            + (this.props.form?.displayProps?.fieldLayout === 'row' ? 'd-md-flex flex-md-row justify-content-md-between': '');
        const fieldLabelClassname = wrapperClassName ? 'field-label d-md-flex align-items-md-center': 'field-label';
        const labelPlacement: any = this.props.form?.labelPlacement;
        return (
            <MFormControl size={this.size} fullWidth className={wrapperClassName}>
                <FormLabel className={fieldLabelClassname}>{meta.displayName}{this.validation.required&&<MandatoryLabel/>}</FormLabel>
                <RadioGroup row={isRow} value={this.props.form?.value} onChange={(e) => {
                    const parentLabel = e.target.closest('label')
                    const datatype = parentLabel ? parentLabel.getAttribute('datatype') : '';
                    if (datatype) {
                        switch (datatype) {
                            case 'boolean':
                                const val = e.target.value === 'true' ? true : false;
                                this.handleChange(e, val);
                                break;
                            default:
                                this.handleChange(e);
                        }
                    } else {
                        this.handleChange(e)
                    }
                }}>
                    {
                        meta.options && meta.options.map(option=>{
                            const datatype = typeof option.value;
                            return (<FormControlLabel datatype={datatype} labelPlacement={labelPlacement} key={option.value} value={option.value} control={<Radio />} label={option.label} />)
                        })
                    }
                </RadioGroup>
            </MFormControl>
        )
    }
    radioButton(): JSX.Element {
        const meta = this.props.form;
        const isRow = this.props.form?.displayProps?.optionsLayout === 'row' ? true : undefined;
        const wrapperClassName = 'meta-form-control-' + this.field.name
            + (this.props.form?.displayProps?.fieldLayout === 'row' ? 'd-md-flex flex-md-row justify-content-md-between': '');
        const fieldLabelClassname = wrapperClassName ? 'field-label d-md-flex align-items-md-center': 'field-label';
        const labelPlacement: any = this.props.form?.labelPlacement;

        return (
            <MFormControl size={this.size} fullWidth className={wrapperClassName}>
                <FormLabel className={fieldLabelClassname}>{meta.displayName}{this.validation.required&&<MandatoryLabel/>}</FormLabel>
                <div className='row' onClick={(e)=>{
                    const button = e.target;
                    const datatype = button && button['getAttribute'] ? button['getAttribute']('datatype') : '';
                    if (datatype) {
                        switch (datatype) {
                            case 'boolean':
                                const val = e.target['value'] === 'true' ? true : false;
                                this.handleChange(e, val);
                                break;
                            default:
                                this.handleChange(e);
                        }
                    } else {
                        this.handleChange(e)
                    }
                }}>
                {
                    meta.options && meta.options.map(option => {
                        const datatype = typeof option.value;
                        const className = option.value === meta.value ? 'selected' : '';
                        return (<div className='col' key={option.value}>
                            <Button className={className} datatype={datatype} value={option.value} 
                                variant="outlined" size="large" sx={{
                                padding: '1.4rem'
                            }} fullWidth>{option.label}</Button>
                        </div>)
                    })
                }
                </div>
            </MFormControl>
        )
    }
    checkbox(): JSX.Element {
        const meta = this.props.form;
        const wrapperClassName = 'meta-form-control-' + this.field.name
        return (
            <FormGroup>
                {
                    meta.options && meta.options.map((option: {label: string, value: any}) => {
                        return (
                            <FormControlLabel className={wrapperClassName} key={option.value} value={option.value} control={<Checkbox checked={option.value === this.props.form.value} 
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    this.handleChange(e, checked ? option.value : '');
                                    this.handleValidation();
                                }}
                                disabled={this.props.form.isDisabled}
                            />} label={option.label}
                            />
                        )
                    })
                }
                {this.showValidation()}
            </FormGroup>
        )
    }
    select() {
        const meta = this.props.form;
        const options = this.props.form.options || [];
        const variant = this.getVariant();
        const label = this.getDisplayLabel();
        const wrapperClassName = 'meta-form-control-' + this.field.name;
        const infoText = this.props.form?.validation?.info_detail?.infoMsg;
        return (
            <MFormControl size={this.size} fullWidth error={this.state.error.hasError ? true: undefined} 
                variant={variant}
                className={wrapperClassName}>
                <InputLabel className="meta-select-label">{label}</InputLabel>
                <Select
                    label={meta.displayName}
                    value={this.props.form?.value}
                    disabled={this.props.form.isDisabled}
                    onOpen={(e) => {
                        if (this.props.form.events?.open) {
                            this.handleOpen(e);
                        }
                    }}
                    onChange={(e) => {
                        const val = e.target.value;
                        const ref = options.find(o => o.value === val);
                        this.handleChange(e,undefined,ref);
                    }}
                    onBlur={this.handleValidation.bind(this)}>
                    {
                        options && options.map((option: {label: string, value: string})=>{
                            const datatype = typeof option.value;
                            return (<MenuItem key={option.value} datatype={datatype} value={option.value}>{option.label}</MenuItem>)
                        })
                    }
                </Select>
                {this.showValidation(infoText)}
            </MFormControl>
        )
    }
    multiselect(): JSX.Element {
        const meta = this.props.form;
        const options = this.props.form.options || [];
        const variant = this.getVariant();
        const label = this.getDisplayLabel();
        const wrapperClassName = 'meta-form-control-' + this.field.name;
        return (
            <MFormControl size={this.size} fullWidth error={this.state.error.hasError ? true: undefined} 
                variant={variant}
                className={wrapperClassName}>
                <InputLabel className="meta-select-label">{label}</InputLabel>
                <Select
                    multiple
                    label={meta.displayName}
                    value={this.props.form?.value}
                    disabled={this.props.form.isDisabled}
                    onOpen={(e) => {
                        if (this.props.form.events?.open) {
                            this.handleOpen(e);
                        }
                    }}
                    onChange={(e) => {
                        const val = e.target.value;
                        const ref = options.find(o => o.value === val);
                        this.handleChange(e,undefined,ref);
                    }}
                    onBlur={this.handleValidation.bind(this)}>
                    {
                        options && options.map((option: {label: string, value: string})=>{
                            const datatype = typeof option.value;
                            return (<MenuItem key={option.value} datatype={datatype} value={option.value}>{option.label}</MenuItem>)
                        })
                    }
                </Select>
                {this.showValidation()}
            </MFormControl>
        )
    }
    button() {
        return (
            <Button variant="contained">Contained</Button>
        )
    }
    search() {
        const restConfig = this.context.getRestConfig();
        return (
            <MuiSearch name={this.field.name}
                form={this.props.form} 
                label={this.getDisplayLabel()||""}
                variant={this.getVariant()} 
                config={restConfig}
                handleChange={this.handleChange.bind(this)}
                handleValidation={this.handleValidation.bind(this)}
                context={this.context}
                section={this.section}
                error={this.state.error}
                loading={this.state.loading}
            />
        )
    }
    showValidation(infoMsg?: string) {
        let className = '';
        let icon = '';
        if (this.state.error.hasError) {
            className = 'meta-validation-error';
            icon = this.context.getIcon('error');
        } else {
            if (infoMsg) {
                className = 'meta-validation-info';
                icon = this.context.getIcon('info');
            }
        }
        return (
            <FormHelperText className={className}>
                {icon}
                {this.state.error.errorMsg || infoMsg}
            </FormHelperText>
        )
    }
}