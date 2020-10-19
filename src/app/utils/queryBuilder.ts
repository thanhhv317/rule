import { QueryBuilderComponent, ColumnsModel, TemplateColumn } from '@syncfusion/ej2-angular-querybuilder';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { getComponent, createElement } from '@syncfusion/ej2-base';

export class QueryBuilder {
    public a = 5;

    public qryBldrObj: QueryBuilderComponent;
    public inOperators: string[] = ['in', 'notin'];
    
    public paymentTemplate: TemplateColumn = {
        create: () => {
            return createElement('input', { attrs: { 'type': 'text' } });
        },
        destroy: (args: { elementId: string }) => {
            let multiSelect: MultiSelect = (getComponent(document.getElementById(args.elementId), 'multiselect') as MultiSelect);
            if (multiSelect) {
                multiSelect.destroy();
            }
            let dropdown: DropDownList = (getComponent(document.getElementById(args.elementId), 'dropdownlist') as DropDownList);
            if (dropdown) {
                dropdown.destroy();
            }
        },
        write: (args: { elements: Element, values: string[] | string, operator: string }) => {
            let ds: string[] = ['Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'Wallet'];
            if (this.inOperators.indexOf(args.operator) > -1) {
                let multiSelectObj: MultiSelect = new MultiSelect({
                    dataSource: ds,
                    value: args.values as string[],
                    mode: 'CheckBox',
                    placeholder: 'Select Transaction',
                    change: (e: any) => {
                        this.qryBldrObj.notifyChange(e.value, e.element);
                    }
                });
                multiSelectObj.appendTo('#' + args.elements.id);
            } else {
                let dropDownObj: DropDownList = new DropDownList({
                    dataSource: ds,
                    value: args.values as string,
                    change: (e: any) => {
                        this.qryBldrObj.notifyChange(e.itemData.value, e.element);
                    }
                });
                dropDownObj.appendTo('#' + args.elements.id);
            }
        }
    };;
    public filter: ColumnsModel[] = [
        { field: 'Category', label: 'Category', type: 'string' },
        { field: 'PaymentMode', label: 'Payment Mode', type: 'string', template: this.paymentTemplate },
        { field: 'TransactionType', label: 'Transaction Type', type: 'string' },
        { field: 'Description', label: 'Description', type: 'string' },
        { field: 'Date', label: 'Date', type: 'date' },
        { field: 'Amount', label: 'Amount', type: 'number' }
    ];;


}