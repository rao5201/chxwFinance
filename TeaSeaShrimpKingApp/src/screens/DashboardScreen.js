import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMarketOverview } from '../store/marketSlice';
import { getCurrentUser } from '../store/authSlice';
import { getTransactionHistory } from '../store/transactionsSlice';
import { getAssets } from '../store/assetsSlice';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { overview, loading: marketLoading } = useSelector(state => state.market);
  const { assets, loading: assetsLoading } = useSelector(state => state.assets);
  const { transactions, loading: transactionsLoading } = useSelector(state => state.transactions);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(getMarketOverview());
    dispatch(getCurrentUser());
    dispatch(getAssets());
    dispatch(getTransactionHistory());
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, []);

  // 计算总资产价值
  const calculateTotalAssets = () => {
    if (!assets || assets.length === 0) return 0;
    return assets.reduce((total, asset) => total + (asset.price * (asset.holdings || 0)), 0);
  };

  // 获取最近交易
  const recentTransactions = transactions.slice(0, 5);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {/* 用户信息 */}
      <View style={styles.userSection}>
        <View>
          <Text style={styles.greeting}>您好，{user?.username || '用户'}</Text>
          <Text style={styles.balance}>账户余额: ¥{user?.balance || 0}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* 市场概览 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>市场概览</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Market')}>
            <Text style={styles.seeMore}>查看更多</Text>
          </TouchableOpacity>
        </View>
        
        {marketLoading ? (
          <Text style={styles.loading}>加载中...</Text>
        ) : overview ? (
          <View style={styles.marketCard}>
            <View style={styles.marketItem}>
              <Text style={styles.marketLabel}>总市值</Text>
              <Text style={styles.marketValue}>¥{overview.totalMarketCap?.toLocaleString() || '0'}</Text>
            </View>
            <View style={styles.marketItem}>
              <Text style={styles.marketLabel}>24h交易量</Text>
              <Text style={styles.marketValue}>¥{overview.totalVolume24h?.toLocaleString() || '0'}</Text>
            </View>
            <View style={styles.marketItem}>
              <Text style={styles.marketLabel}>市场趋势</Text>
              <Text style={[
                styles.marketValue,
                overview.marketTrend === 'up' ? styles.upTrend : styles.downTrend
              ]}>
                {overview.marketTrend === 'up' ? '上涨' : '下跌'}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noData}>暂无市场数据</Text>
        )}
      </View>

      {/* 资产概览 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>资产概览</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Assets')}>
            <Text style={styles.seeMore}>查看更多</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.assetCard}>
          <Text style={styles.assetTotalLabel}>总资产</Text>
          <Text style={styles.assetTotalValue}>¥{calculateTotalAssets().toLocaleString()}</Text>
          
          <View style={styles.assetList}>
            {assetsLoading ? (
              <Text style={styles.loading}>加载中...</Text>
            ) : assets && assets.length > 0 ? (
              assets.slice(0, 3).map((asset, index) => (
                <View key={index} style={styles.assetItem}>
                  <View>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetHoldings}>{asset.holdings || 0} {asset.symbol}</Text>
                  </View>
                  <Text style={styles.assetPrice}>¥{asset.price?.toLocaleString() || '0'}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noData}>暂无资产数据</Text>
            )}
          </View>
        </View>
      </View>

      {/* 最近交易 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近交易</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeMore}>查看更多</Text>
          </TouchableOpacity>
        </View>
        
        {transactionsLoading ? (
          <Text style={styles.loading}>加载中...</Text>
        ) : recentTransactions.length > 0 ? (
          <View style={styles.transactionCard}>
            {recentTransactions.map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View>
                  <Text style={styles.transactionType}>
                    {transaction.type === 'buy' ? '买入' : '卖出'}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {new Date(transaction.createdAt).toLocaleString()}
                  </Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'buy' ? styles.buyAmount : styles.sellAmount
                ]}>
                  {transaction.type === 'buy' ? '+' : '-'}
                  ¥{transaction.totalAmount?.toLocaleString() || '0'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noData}>暂无交易记录</Text>
        )}
      </View>

      {/* 快捷操作 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快捷操作</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Market')}
          >
            <Text style={styles.quickActionIcon}>📈</Text>
            <Text style={styles.quickActionText}>市场</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Assets')}
          >
            <Text style={styles.quickActionIcon}>💼</Text>
            <Text style={styles.quickActionText}>资产</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Transactions')}
          >
            <Text style={styles.quickActionIcon}>🔄</Text>
            <Text style={styles.quickActionText}>交易</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AI')}
          >
            <Text style={styles.quickActionIcon}>🤖</Text>
            <Text style={styles.quickActionText}>AI分析</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  balance: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 24,
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeMore: {
    fontSize: 14,
    color: '#667eea',
  },
  marketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  marketLabel: {
    fontSize: 14,
    color: '#666',
  },
  marketValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  upTrend: {
    color: '#10b981',
  },
  downTrend: {
    color: '#ef4444',
  },
  assetCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  assetTotalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  assetTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  assetList: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  assetHoldings: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  assetPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  buyAmount: {
    color: '#10b981',
  },
  sellAmount: {
    color: '#ef4444',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '22%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  noData: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
});

export default DashboardScreen;