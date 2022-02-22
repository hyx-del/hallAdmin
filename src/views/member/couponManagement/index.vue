<template>
    <div>
        <formList
            :config="config"
            :itemList="itemList"
            :formInitData="formInitData"
            :buttons="buttons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="formInitData"
            :showSortIndex="{ show: true, lable: '序号' }"
        />
        <!-- 兑换界面 -->
        <el-dialog v-model="dialogVisible" title="生成码" width="50%">
            <el-button
                type="primary"
                @click="
                    addExchangeCodeModal = true;
                    showState = 1;
                "
                >生成兑换码</el-button
            >
            <el-button
                type="primary"
                @click="
                    addExchangeCodeModal = true;
                    showState = 2;
                "
                >生成口令码</el-button
            >
            <!-- 口令码 -->
            <Table
                ref="commandTable"
                :loadData="commandCodeList"
                :column="commandColumn"
                :headHight="200"
                :params="searchData"
            />
            <!-- 兑换码 -->
            <Table
                ref="exchangeTable"
                :loadData="exchangeCodeList"
                :column="exchangeColumn"
                :headHight="200"
                :params="searchData"
            />
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 生成兑换码 -->
        <popupForm
            v-model:show="addExchangeCodeModal"
            v-model:formInitData="popFormInitData"
            :title="showState === 1 ? '生成兑换码' : '生成口令码'"
            :itemList="popItemList"
            :buttons="popButtons"
        />
        <!-- 口令码详情 -->
        <el-dialog v-model="detailsModal" title="兑换码详情" width="50%">
            <formList
                :config="config"
                :itemList="detailsItemList"
                :buttons="detailsButtons"
            />
            <Table
                ref="detailsTable"
                :loadData="exchangeCodeDetails"
                :column="detailsColumn"
                :headHight="400"
                :params="detailsSearchData"
            />
        </el-dialog>
        <!-- <popup v-model:show="detailsModal" title="兑换码详情">
            <Table
                ref="exchangeTable"
                :loadData="exchangeCodeList"
                :column="exchangeColumn"
                :headHight="400"
                :params="detailsSearchData"
            />
        </popup> -->
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    couponList,
    updateMemberCouponStatus,
    deleteMemberCoupon,
    commandCodeList,
    exchangeCodeList,
    addExchangeCode,
    addCommandCode,
    exchangeCodeDetails,
} from "@/api/member";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { deleteItem } from "@/utils/tools";
import { getListHtml, accessChannelList } from "@/utils/enum/select";
import popupForm from "@/components/FormList/popupForm.vue";
import popup from "@/components/popup/index.vue";
export default {
    components: {
        formList,
        Table,
        popupForm,
        popup,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        // 兑换码表格
        const exchangeTable = ref(null);
        // 口令表格
        const commandTable = ref(null);
        // 兑换码详情表格
        const detailsTable = ref(null);
        const state = reactive({
            getList: couponList,
            column: [
                {
                    prop: "name",
                    label: "名称",
                    width: 150,
                },
                {
                    prop: "discount",
                    label: "优惠金额（元）",
                },
                {
                    prop: "price",
                    label: "售价",
                },
                {
                    prop: "type",
                    label: "类型",
                    html: (row, item) => (+item === 1 ? "代金券" : "联卡券"),
                },
                {
                    prop: "accessChannel",
                    label: "渠道类型",
                    html: (row, item) => getListHtml(accessChannelList, item),
                },
                {
                    prop: "effectiveDays",
                    label: "有效天数",
                },
                {
                    prop: "effectiveTime",
                    label: "生效时间",
                    width: 180,
                },
                {
                    prop: "expirationTime",
                    label: "失效时间",
                    width: 180,
                },
                {
                    prop: "amount",
                    label: "数量",
                    width: 120,
                },
                {
                    prop: "createdAt",
                    label: "创建时间",
                    width: 180,
                },

                {
                    prop: "status",
                    label: "状态",
                    html: (row, item) => (item ? "上线" : "下线"),
                },

                {
                    prop: "action",
                    label: "操作",
                    width: 260,
                    actives: [
                        {
                            name: ({ status }) => (status ? "下线" : "上线"),
                            method: ({ id, name, status }) => {
                                ElMessageBox.confirm(
                                    `确认${
                                        status ? "下线" : "上线"
                                    }名称为${name}的优惠券？`
                                )
                                    .then(() => {
                                        updateMemberCouponStatus({
                                            id,
                                            status: !status ? 1 : 0,
                                        }).then(({ code, data, msg }) => {
                                            if (code === 200) {
                                                // data为true表示可以删除，否则弹出强制删除提示
                                                if (data) {
                                                    ElMessage.success({
                                                        message:
                                                            msg || "操作成功",
                                                        duration: 500,
                                                        onClose: () => {
                                                            TableList.value.update();
                                                        },
                                                    });
                                                } else {
                                                    // 强制删除确认
                                                    mandatory({ status, id });
                                                }
                                            } else {
                                                ElMessage.error({
                                                    message: msg || "操作失败",
                                                });
                                            }
                                        });
                                    })
                                    .catch(() => {});
                            },
                        },
                        {
                            name: "编辑",
                            method: ({ id }) =>
                                router.push({
                                    path: "/couponManagementh/add",
                                    query: {
                                        id,
                                    },
                                }),
                        },
                        {
                            name: ({ accessChannel }) =>
                                +accessChannel === 3 && "生成码",
                            method: ({ id }) => {
                                state.couponId = id;
                                state.dialogVisible = true;
                                state.searchData.couponId = id;
                                // 更新兑换码和口令码
                                exchangeTable.value &&
                                    exchangeTable.value.update();
                                commandTable.value &&
                                    commandTable.value.update();
                            },
                        },
                        {
                            name: "删除",
                            method: (val) =>
                                deleteItem(val, deleteMemberCoupon, TableList),
                        },
                    ],
                },
            ],
            formInitData: {},
            itemList: [
                {
                    lableShow: false,
                    code: "name",
                    label: "名称",
                },
                {
                    el: "select",
                    code: "type",
                    label: "类型",
                    list: [
                        { label: "代金券", value: "1" },
                        { label: "联卡券", value: "2" },
                    ],
                },
                {
                    el: "select",
                    code: "accessChannel",
                    label: "获取渠道",
                    list: accessChannelList,
                },
                {
                    el: "select",
                    code: "status",
                    label: "状态",
                    list: [
                        { label: "上线", value: "1" },
                        { label: "下线", value: "0" },
                    ],
                },
            ],
            config: {
                allRequired: false, // 是否全部必填
                inline: true, //行内
                colon: "",
                inputStyle: {
                    width: "200px",
                },
            },
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update(value);
                    },
                },
                {
                    funType: "add",
                    type: "primary",
                    name: "新 增",
                    click: () => {
                        router.push({
                            path: "/couponManagementh/add",
                        });
                    },
                },
            ],
            // 兑换界面
            dialogVisible: false,
            //兑换码表格字段
            exchangeColumn: [
                {
                    prop: "batchNumber",
                    label: "批号",
                },
                {
                    prop: "amount",
                    label: "兑换码数量",
                },
                {
                    prop: "redeemedAmount",
                    label: "已兑数量",
                    html: ({ redeemedAmount }) => "" + redeemedAmount,
                },
                {
                    prop: "codeExchangeableAmount",
                    label: "每个兑换码可兑换数量",
                },
                {
                    prop: "notes",
                    label: "备注",
                },
                {
                    prop: "createdAt",
                    label: "创建时间",
                    width: 180,
                },
                {
                    prop: "action",
                    label: "操作",
                    width: 80,
                    actives: [
                        {
                            name: "详情",
                            method: ({ id }) => {
                                state.detailsSearchData.id = id;
                                state.detailsModal = true;
                                detailsTable.value &&
                                    detailsTable.value.update();
                            },
                        },
                    ],
                },
            ],
            // 口令码表格字段
            commandColumn: [
                {
                    prop: "redeemCode",
                    label: "口令码",
                    width: 150,
                },
                {
                    prop: "redeemedAmount",
                    label: "已兑数量",
                    width: 120,
                    html: ({ redeemedAmount }) => "" + redeemedAmount,
                },
                {
                    prop: "exchangeableAmount",
                    label: "可兑券数量",
                    width: 120,
                },
                {
                    prop: "notes",
                    label: "备注",
                },
                {
                    prop: "createdAt",
                    label: "创建时间",
                },
            ],
            // 1.生成兑换码 2.生成口令码
            showState: 1,
            addExchangeCodeModal: false,
            searchData: { couponId: null },
            popFormInitData: {},
            popItemList: [
                {
                    code: "amount",
                    label: "本批次兑换券总数量",
                    checkType: "numbers",
                    maxCode: 100000,
                    show: computed(() => state.showState === 1),
                },
                {
                    code: "exchangeableAmount",
                    label: "每个兑换券可兑券数量",
                    placeholder: "请输入",
                    maxCode: 100000,
                    checkType: "numbers",
                    show: computed(() => state.showState === 1),
                },
                {
                    code: "passCode",
                    label: "设置口令码",
                    show: computed(() => state.showState === 2),
                },
                {
                    code: "exchangeableAmount",
                    label: "可兑券总数量",
                    maxCode: 100000,
                    checkType: "numbers",
                    show: computed(() => state.showState === 2),
                },
                {
                    el: "textArea",
                    label: "备注",
                    code: "notes",
                    required: false,
                    maxlength: 60,
                    row: 10,
                },
            ],
            popButtons: [
                {
                    name: "取消",
                    click: () => {
                        console.log(213123);
                        state.addExchangeCodeModal = false;
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        if (state.showState === 1) {
                            // 生成兑换码
                            addExchangeCode({
                                ...value,
                                couponId: state.couponId,
                            }).then(({ code, msg }) => {
                                if (code === 200) {
                                    ElMessage.success({
                                        message: msg || "操作成功",
                                        duration: 500,
                                        onClose: () => {
                                            exchangeTable.value.update();
                                        },
                                    });
                                } else {
                                    ElMessage.error({
                                        message: msg || "操作失败",
                                    });
                                }
                            });
                        } else {
                            // 口令码
                            addCommandCode({
                                ...value,
                                couponId: state.couponId,
                            }).then(({ code, msg }) => {
                                if (code === 200) {
                                    ElMessage.success({
                                        message: msg || "操作成功",
                                        duration: 500,
                                        onClose: () => {
                                            commandTable.value.update();
                                        },
                                    });
                                } else {
                                    ElMessage.error({
                                        message: msg || "操作失败",
                                    });
                                }
                            });
                        }
                        state.addExchangeCodeModal = false;
                    },
                },
            ],
            // 兑换码详情
            detailsSearchData: { id: 208 },
            detailsModal: false,
            detailsFormInitData: {},
            detailsColumn: [
                {
                    code: "batch_number",
                    label: "批号",
                    html: ({ batch_number }) => batch_number,
                },
                {
                    code: "redeemCode",
                    label: "兑换码",
                    html: ({ redeemCode }) => redeemCode,
                },
                {
                    code: "exchangeableAmount",
                    label: "可兑换优惠券数量",
                    html: ({ exchangeableAmount }) => exchangeableAmount,
                },
                {
                    code: "redeemedAmount",
                    label: "已兑券数量",
                    html: ({ redeemedAmount }) => "" + redeemedAmount,
                },
                {
                    code: "status",
                    label: "兑券状态",
                    html: ({ status }) => (+status === 4 ? "未兑换" : "已兑换"),
                },
            ],
            detailsButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        detailsTable.value.update(value);
                    },
                },
            ],
            detailsItemList: [
                {
                    code: "redeemCode",
                    label: "兑换码",
                },
                {
                    el: "select",
                    code: "status",
                    label: "兑换状态",
                    list: [
                        { label: "未兑换", value: "4" },
                        { label: "已兑换", value: "6" },
                    ],
                },
            ],
        });
        // 强制下线
        const mandatory = ({ status, id }) => {
            ElMessageBox.confirm("还有用户未使用该券，是否强制下线?")
                .then(() => {
                    let params = {
                        id,
                        offlineConfirm: true,
                        status: !status ? 1 : 0,
                    };
                    updateMemberCouponStatus(params).then(
                        ({ code, data, msg }) => {
                            if (code === 200 && data) {
                                ElMessage.success({
                                    message: msg || "操作成功",
                                    duration: 500,
                                    onClose: () => {
                                        TableList.value.update();
                                    },
                                });
                            } else {
                                ElMessage.error({
                                    message: msg || "操作失败",
                                });
                            }
                        }
                    );
                })
                .catch(() => {});
        };
        return {
            ...toRefs(state),
            TableList,
            mandatory,
            commandCodeList,
            exchangeCodeList,
            commandTable,
            exchangeTable,
            exchangeCodeDetails,
            detailsTable,
        };
    },
};
</script>

<style lang="scss" scoped>
.name {
    cursor: pointer;
    color: #2e8de6;
}
</style>
