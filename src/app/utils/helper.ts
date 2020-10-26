export class Helper {
    protected valueOfCondition = [
        { value: "BUY", key: 'Nạp tiền điện thoại' },
        { value: "POSTPAID", key: 'Trả sau' },
        { value: "BILLPAY", key: 'Thanh toán hóa đơn' },
        { value: "BUYCODE", key: 'Mua mã thẻ' },
        { value: "CASHIN", key: 'Nạp tiền từ ngân hàng' },
        { value: "CASHOUT", key: 'Rút tiền về ngân hàng' },
        { value: "BANK_TRANSFER", key: 'Chuyển tiền về từ ngân hàng' },
        { value: "topup", key: 'Topup' },
        { value: "evn", key: 'HĐ Điện' },
        { value: "buycard", key: 'HĐ Nước' },
        { value: "water", key: 'Mua mã thẻ(dt, game, data)' },
        { value: "vte", key: 'Viettel' },
        { value: "mbf", key: 'Vinaphone' },
        { value: "vnp", key: 'Mobifone' },
        { value: "1", key: 'Ví ECO' },
        { value: "2", key: 'COD' },
        { value: "3", key: 'NH liên kết' },
        { value: "4", key: 'NH hỗ trợ' },
        { value: "5", key: 'eFund' },
        { value: "bidv", key: 'NH liên kết BIDV' },
        { value: "stb", key: 'NH liên kết Sacombank' },
        { value: "napas", key: 'NH hỗ trợ Napas' },
        { value: "ibft", key: 'Chuyễn tiền IBFP' },
    ];

    public listAction = [
        [
            { field: 'Event name', name: 'type', type: "text" },
            { field: 'Path', name: 'path', type: "text" },
            { field: 'Fixed value', name: 'e_value_base', type: "number" },
            { field: 'Percent value (%)', name: 'e_value_rate', type: "number" },
            { field: 'Max value', name: 'max_value', type: "number" },
            { field: 'Min value', name: 'min_value', type: "number" }
        ],
        [
            { field: 'Event name', name: 'type', type: "text" },
            { field: 'Connector name', name: 'connector_name', type: "text" },
            { field: 'Limit', name: 'limit', type: "number" }
        ],
        [],
        [
            { field: 'Event name', name: 'type', type: "text" },
            { field: 'Path', name: 'path', type: "text" },
            { field: 'Fixed value', name: 'e_value_base', type: "number" },
            { field: 'Percent value (%)', name: 'e_value_rate', type: "number" },
            { field: 'Max value', name: 'max_value', type: "number" },
            { field: 'Min value', name: 'min_value', type: "number" }
        ]
    ];

    public conditionName = [
        ['Nạp tiền điện thoại', 'Trả sau', 'Thanh toán hóa đơn', 'Mua mã thẻ', 'Nạp tiền từ ngân hàng', 'Rút tiền về ngân hàng', 'Chuyển tiền về từ ngân hàng'],
        ['Topup', 'HĐ Điện', 'HĐ Nước', 'Mua mã thẻ(dt, game, data)'],
        ['Viettel', 'Vinaphone', 'Mobifone'],
        ['Ví ECO', 'COD', 'NH liên kết', 'NH hỗ trợ', 'eFund'],
        ['NH liên kết BIDV', 'NH liên kết Sacombank', 'NH hỗ trợ Napas', 'Chuyển tiền IBFP']
    ];

    public operator = [
        { value: 'equal', key: 'Equal' },
        { value: 'notequal', key: 'Not Equal' },
        { value: 'in', key: 'In' },
        { value: 'notin', key: 'Not In' }
    ];

    public getValueFromKey(key: string): string {
        let result = this.valueOfCondition.find((x) => x.key === key);
        return result ? result.value : key;
    }

    public getKeyFromValue(value: string): string {
        let result = this.valueOfCondition.find((x) => x.value === value);
        return result ? result.key : value;
    }
}