import { Layout, Skeleton } from 'antd';

export const Loading = () => {
  const { Sider, Content } = Layout;

  return (
    <div className='mt-20'>
      <Layout style={{ minHeight: "50vh", marginTop: "12px" }}>
        <Layout style={{ flex: 1, flexDirection: "row-reverse" }}>
          <Sider width={400} theme="light" style={{ padding: "12px" }}>
            <Content style={{ padding: "12px", marginTop: "8px" }}>
              <Skeleton
                style={{ width: "100%", background: "#fff" }}
                active={true}
                paragraph={{ rows: 8 }}
              />
            </Content>
          </Sider>
          <Content style={{ padding: "12px", marginTop: "16px", background:"#fff" }}>
            <Skeleton
              style={{ width: "100%"}}
              active={true}
              paragraph={{ rows: 14 }}
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
