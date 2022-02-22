
<template>
    <div>
        <!-- 按钮 -->
        <el-upload
            class="upload"
            action=""
            :multiple="false"
            :show-file-list="false"
            :http-request="httpRequest">
            <el-button size="small" type="primary">上传</el-button>
        </el-upload>

    </div>
</template>

<script>
import { toRefs, ref, reactive, computed } from "vue";

export default {
    setup() {
        const httpRequest  = (e) => {
            let file = e.file // 文件信息
            console.log('e: ', e)
            console.log('file: ', e.file)
            const state = reactive({
                contentHtml:''
            })
                // contentHtml
            if (!file) {
                // 没有文件
                return false
            } else {
                const fileReader = new FileReader()

                fileReader.onload = (ev) => {
                    try {
                        const data = ev.target.result
                        let json=JSON.parse(data)
                        console.log(json)

                    } catch (e) {
                        console.log('出错了：：')
                        return false
                    }
                }
                fileReader.readAsBinaryString(file)
            }

        }
        return{
            httpRequest
        }
    }
}
</script>
